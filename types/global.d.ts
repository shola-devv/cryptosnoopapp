declare global {
  interface Window {
    ethereum?: any
    // Google Analytics gtag function
    gtag?: (...args: any[]) => void
  }
}

export {}
