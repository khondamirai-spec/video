'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="landing-page">
      <div className="button-container">
        <Link href="/videos" className="landing-button landing-button-primary">
          <svg className="button-icon" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="11" fill="white" opacity="0.9"/>
            <path d="M10 8l6 4-6 4V8z" fill="#000"/>
          </svg>
          <span>Ustoz AI orqali daromad topganlar</span>
        </Link>
        
        <Link href="/opportunities" className="landing-button landing-button-secondary">
          <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.8">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span>Moliyaviy imkoniyatlar</span>
        </Link>
      </div>
    </main>
  )
}
