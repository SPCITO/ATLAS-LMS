import os
import re
import time
import asyncio
import shutil
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError

BASE_FILE = "External_Training_Report.docx"
if not os.path.exists(BASE_FILE):
    with open(BASE_FILE, "w") as f:
        f.write("Sample document content for automated performance testing.")


async def run_single_iteration(browser, run_id: int) -> dict:
    """Executes a single end-to-end user workflow run."""
    run_start = time.perf_counter()
    metrics = {"user_id": run_id, "steps": {}, "error": None}

    unique_file_name = f"Test_Doc_Run_{run_id}.docx"
    shutil.copyfile(BASE_FILE, unique_file_name)

    async def measure(step_name, coro):
        s_time = time.perf_counter()
        await coro()
        dur = time.perf_counter() - s_time
        metrics["steps"][step_name] = dur
        return dur

    context = await browser.new_context()
    page = await context.new_page()

    try:
        print(f"▶️ [Run #{run_id}/5] Executing sequence...")

        teacher_id = "TCH-123123"
        student_id = "STD-12312345"

        async def go_to_login():
            await context.clear_cookies()
            await page.goto("http://localhost:3000/", wait_until="domcontentloaded")
            enter_link = page.get_by_role("link", name="Enter Portal")
            if await enter_link.is_visible(timeout=3000):
                await enter_link.click()

        async def perform_login(user_id):
            school_input = page.get_by_role("textbox", name=re.compile(r"School ID", re.IGNORECASE))
            await school_input.wait_for(state="visible", timeout=15000)
            await school_input.fill(user_id)
            
            pwd_input = page.get_by_role("textbox", name=re.compile(r"Password", re.IGNORECASE))
            await pwd_input.fill("123123")
            
            submit_btn = page.get_by_role("button", name=re.compile(r"Continue|Login|Sign In", re.IGNORECASE))
            await submit_btn.click()

        async def navigate_to_syllabus():
            eval_tab = page.get_by_role("tab", name=re.compile(r"Evaluations", re.IGNORECASE)).or_(
                page.get_by_text("Evaluations")
            ).first
            await eval_tab.wait_for(state="visible", timeout=20000)
            await eval_tab.click()

            syl_tab = page.get_by_role("tab", name=re.compile(r"Syllabus Modules", re.IGNORECASE)).or_(
                page.get_by_text("Syllabus Modules")
            ).first
            await syl_tab.wait_for(state="visible", timeout=15000)
            await syl_tab.click()

        # ----------------------------------------------------------------------
        # 1. TEACHER FLOW
        # ----------------------------------------------------------------------
        async def teacher_flow():
            await go_to_login()
            await perform_login(teacher_id)
            await navigate_to_syllabus()

            add_btn = page.get_by_role("button", name=re.compile(r"Add Module", re.IGNORECASE))
            await add_btn.wait_for(state="visible", timeout=10000)
            await add_btn.click()

            file_input = page.locator("input[type=\"file\"]")
            await file_input.wait_for(state="attached", timeout=10000)
            await file_input.set_input_files(unique_file_name)

            deploy_btn = page.get_by_role("button", name=re.compile(r"Deploy", re.IGNORECASE))
            await deploy_btn.click()

            uploaded_card = page.get_by_text(f"Run_{run_id}").first
            await uploaded_card.wait_for(state="visible", timeout=15000)

            prof_btn = page.get_by_role("button", name=re.compile(r"Profile View|Profile", re.IGNORECASE))
            if await prof_btn.is_visible(timeout=3000):
                await prof_btn.click()
                disc_btn = page.get_by_role("button", name=re.compile(r"Disconnect Session|Logout", re.IGNORECASE))
                if await disc_btn.is_visible(timeout=3000):
                    await disc_btn.click()

        await measure("1. Teacher Login & Deploy", teacher_flow)

        # ----------------------------------------------------------------------
        # 2. STUDENT FLOW
        # ----------------------------------------------------------------------
        async def student_flow():
            await go_to_login()
            await perform_login(student_id)

            view_btn = page.get_by_role("button", name=re.compile(r"View Document", re.IGNORECASE)).first
            
            for attempt in range(4):
                try:
                    await view_btn.wait_for(state="visible", timeout=5000)
                    break
                except PlaywrightTimeoutError:
                    if attempt < 3:
                        await page.reload(wait_until="domcontentloaded")
                    else:
                        raise

            await view_btn.click()

            # Dismiss inner Word error modal if present
            try:
                doc_viewer = page.frame_locator("iframe[title=\"Document Viewer\"]")
                wac_frame = doc_viewer.frame_locator("iframe[name=\"wacframe\"]")
                close_text = wac_frame.get_by_text("Close")
                if await close_text.is_visible(timeout=2000):
                    await close_text.click()
            except Exception:
                pass

            # Close modal using empty-text icon button (the top-right 'X')
            try:
                icon_close_btn = page.get_by_role("button").filter(has_text=re.compile(r"^$")).first
                if await icon_close_btn.is_visible(timeout=3000):
                    await icon_close_btn.click()
                else:
                    await page.keyboard.press("Escape")
            except Exception:
                await page.keyboard.press("Escape")

            # Fallback: Wait for modal iframe to detach
            try:
                await page.locator("iframe[title=\"Document Viewer\"]").wait_for(state="detached", timeout=3000)
            except Exception:
                await page.keyboard.press("Escape")

            # Student Logout
            prof_btn = page.get_by_role("button", name=re.compile(r"Profile View|Profile", re.IGNORECASE))
            await prof_btn.wait_for(state="visible", timeout=10000)
            await prof_btn.click()
            
            disc_btn = page.get_by_role("button", name=re.compile(r"Disconnect Session|Logout", re.IGNORECASE))
            await disc_btn.wait_for(state="visible", timeout=5000)
            await disc_btn.click()

        await measure("2. Student Flow & Navigation", student_flow)

        # ----------------------------------------------------------------------
        # 3. CLEANUP FLOW
        # ----------------------------------------------------------------------
        async def cleanup_flow():
            await go_to_login()
            await perform_login(teacher_id)
            await navigate_to_syllabus()

            page.once("dialog", lambda dialog: asyncio.create_task(dialog.accept()))

            try:
                target_card = page.locator("div, tr, li").filter(has_text=f"Run_{run_id}")
                delete_btn = target_card.get_by_role("button", name=re.compile(r"Delete", re.IGNORECASE))
                if await delete_btn.count() > 0:
                    await delete_btn.first.click()
                else:
                    fallback = page.get_by_role("button", name=re.compile(r"Delete Module", re.IGNORECASE)).first
                    if await fallback.is_visible(timeout=3000):
                        await fallback.click()
            except PlaywrightTimeoutError:
                pass

            prof_btn = page.get_by_role("button", name=re.compile(r"Profile View|Profile", re.IGNORECASE))
            if await prof_btn.is_visible(timeout=3000):
                await prof_btn.click()
                disc_btn = page.get_by_role("button", name=re.compile(r"Disconnect Session|Logout", re.IGNORECASE))
                if await disc_btn.is_visible(timeout=3000):
                    await disc_btn.click()

        await measure("3. Targeted Module Cleanup", cleanup_flow)

        metrics["total_time"] = time.perf_counter() - run_start
        print(f"✅ [Run #{run_id}/5] Finished in {metrics['total_time']:.2f}s")

    except Exception as e:
        metrics["error"] = str(e)
        print(f"❌ [Run #{run_id}/5] Test failed: {e}")

    finally:
        try:
            await context.close()
        except Exception:
            pass
        if os.path.exists(unique_file_name):
            os.remove(unique_file_name)

    return metrics


async def main():
    TOTAL_RUNS = 5
    print(f"\n🚀 Running {TOTAL_RUNS} Sequential Test Iterations (5x Execution)...\n" + "=" * 60)

    total_start = time.perf_counter()
    all_results = []

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            headless=False,
            slow_mo=50
        )

        for i in range(1, TOTAL_RUNS + 1):
            res = await run_single_iteration(browser, i)
            all_results.append(res)

        await browser.close()

    wall_clock_time = time.perf_counter() - total_start
    successful_results = [r for r in all_results if r.get("error") is None]

    print("\n" + "=" * 60)
    print(f"📊 SEQUENTIAL UI TEST RESULTS ({len(successful_results)}/{TOTAL_RUNS} PASSED)")
    print("=" * 60)

    for res in sorted(all_results, key=lambda x: x["user_id"]):
        if res["error"]:
            print(f" • Run #{res['user_id']} ❌ FAILED: {res['error']}")
        else:
            print(f" • Run #{res['user_id']} ✅ PASSED ({res['total_time']:.2f} s)")

    if successful_results:
        step_names = successful_results[0]["steps"].keys()
        print("-" * 60)
        print("⏱️ AVERAGE STEP DURATIONS ACROSS RUNS:")
        for step in step_names:
            avg_dur = sum(r["steps"][step] for r in successful_results if step in r["steps"]) / len(successful_results)
            print(f" • {step:<35}: {avg_dur:.3f} s")

    print(f"⚡ Total 5x Suite Time: {wall_clock_time:.2f} s")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Test suite manually terminated by user.")