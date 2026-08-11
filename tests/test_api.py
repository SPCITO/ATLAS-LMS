import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed


def hit_endpoint(url):
    """Simulates a single lightweight concurrent HTTP user request."""
    start = time.perf_counter()
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'StressTestWorker/1.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            status = response.status
            dur = time.perf_counter() - start
            return True, status, dur
    except Exception as e:
        dur = time.perf_counter() - start
        return False, str(e), dur


def run_stress_test(target_url="http://localhost:3000/dashboard/teacher", total_users=300, max_workers=50):
    print(f"\n🔥 LAUNCHING {total_users}-USER HTTP BACKEND STRESS TEST...")
    print("=" * 60)

    start_time = time.perf_counter()
    results = []

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(hit_endpoint, target_url) for _ in range(total_users)]
        for future in as_completed(futures):
            results.append(future.result())

    total_duration = time.perf_counter() - start_time
    
    successes = [r for r in results if r[0]]
    failures = [r for r in results if not r[0]]
    response_times = [r[2] for r in results]
    avg_response_time = sum(response_times) / len(response_times)
    req_per_sec = total_users / total_duration

    print("\n" + "=" * 60)
    print("💥 300-USER STRESS TEST RESULTS")
    print("=" * 60)
    print(f" • Total Requests Sent       : {total_users}")
    print(f" • Successful Responses (200 OK): {len(successes)}")
    print(f" • Failed / Timed Out Requests: {len(failures)}")
    print(f" • Average Response Time     : {avg_response_time:.3f} s")
    print(f" • Min Response Time         : {min(response_times):.3f} s")
    print(f" • Max Response Time         : {max(response_times):.3f} s")
    print(f" • Server Throughput         : {req_per_sec:.2f} req/sec")
    print(f" • Total Burst Duration      : {total_duration:.2f} s")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    run_stress_test(target_url="http://localhost:3000/dashboard/teacher", total_users=300)