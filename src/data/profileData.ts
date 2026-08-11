export const PROFILE_CONTENT = {
  loading: {
    deauthorizingTitle: "De-authorizing Session",
    deauthorizingDesc: "Flushing regional identity matrices and tearing down secure connection links...",
    synchronizingText: "Synchronizing Security Tokens...",
  },
  roles: {
    faculty: "Faculty Account",
    student: "Student Core Profile",
    fallbackUser: "Active Session User",
    fallbackRank: "Faculty Member",
    fallbackSection: "Academic Department",
  },
  actions: {
    disconnectBtn: "Disconnect Session",
    resetBtn: "Request Credentials Reset",
  },
  registryMatrix: {
    title: "Academic Registry Matrix",
    description: "Synchronized parameters imported from the local legacy system.",
    labels: {
      id: "ID Designation",
      email: "System Email Address",
      rank: "Tracking Rank",
      section: "Assigned Section Block",
      track: "Collegiate Curricular Track",
    },
    fallbacks: {
      id: "N/A",
      email: "No email synchronized",
      programSuffix: "Program Matrix",
    },
  },
  securityConfig: {
    title: "Access Configuration",
    notice: "Passwords are managed using high-grade hashing parameters. Request an update key below.",
    toast: {
      message: "Security Action Triggered",
      description: "A secure verification token has been dispatched to your synchronized email endpoint.",
    },
    errors: {
      message: "Authentication Error",
      description: "Failed to securely terminate identity session. Please check your connection parameters.",
    },
  },
  telemetry: {
    statusTitle: "Operational Node Secure",
    statusDesc: "Verified via Supabase Identity Broker",
  },
};