'use client'

import Link from 'next/link'

interface Opportunity {
  id: string
  name: string
  icon: string
  url: string
}

const opportunities: Opportunity[] = [
  {
    id: '1',
    name: 'Yoshlar Ventures',
    icon: '/ICONS/1.jpg',
    url: 'https://yoshlarventures.uz/uz/',
  },
  {
    id: '2',
    name: 'UzCombinator',
    icon: '/ICONS/2.png',
    url: 'https://www.uzcombinator.uz',
  },
  {
    id: '3',
    name: 'Startup Garage',
    icon: '/ICONS/3.jpg',
    url: 'https://startupgarage.uz',
  },
  {
    id: '4',
    name: "Ko'mak + Imkoniyat 2.0",
    icon: '/ICONS/4.png',
    url: 'https://komak-imkoniyat.uz',
  },
  {
    id: '5',
    name: 'Yoshlar Fondi',
    icon: '/ICONS/6.png',
    url: 'https://yoshlarfondi.uz/old',
  },
  {
    id: '16',
    name: 'Green Fund',
    icon: '/ICONS/Screenshot 2026-01-14 122655.png',
    url: 'https://www.greenclimate.fund/countries/uzbekistan',
  },
  {
    id: '6',
    name: 'UniCorn Uz',
    icon: '/ICONS/7.png',
    url: 'https://unicorns.uz',
  },
  {
    id: '7',
    name: 'United Ventures',
    icon: '/ICONS/5.png',
    url: 'https://uventures.uz',
  },
  {
    id: '8',
    name: 'UzVc',
    icon: '/ICONS/Screenshot 2026-01-14 120040.png',
    url: 'https://uzvc.uz',
  },
  {
    id: '9',
    name: 'IT Park Ventures',
    icon: '/ICONS/Screenshot 2026-01-14 120117.png',
    url: 'https://itparkventures.uz/en',
  },
  {
    id: '10',
    name: 'CS Space',
    icon: '/ICONS/Screenshot 2026-01-14 120128.png',
    url: 'https://cspace.uz',
  },
  {
    id: '11',
    name: 'AICA',
    icon: '/ICONS/Screenshot 2026-01-14 120153.png',
    url: 'https://aica.uz',
  },
  {
    id: '12',
    name: 'Oliy Majlis granti',
    icon: '/ICONS/Screenshot 2026-01-14 120253.png',
    url: 'https://ngo.gov.uz/oz/contests/grants',
  },
  {
    id: '13',
    name: 'Aloqa Bank',
    icon: '/ICONS/Screenshot 2026-01-14 120740.png',
    url: 'https://aloqabank.uz/uz/',
  },
  {
    id: '14',
    name: 'Aloqa Ventures',
    icon: '/ICONS/Screenshot 2026-01-14 120640.png',
    url: 'https://www.aloqaventures.uz',
  },
  {
    id: '15',
    name: 'NBU',
    icon: '/ICONS/Screenshot 2026-01-14 120753.png',
    url: 'https://nbu.uz/en',
  },
]

export default function OpportunitiesPage() {
  const handleRowClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="opportunities-page">
      <Link href="/" className="opportunities-back-button" aria-label="Go back">
        <svg style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </Link>

      <h1 className="opportunities-title">Moliyaviy Imkoniyatlar</h1>

      <div className="opportunities-container">
        {opportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            className="opportunity-row"
            onClick={() => handleRowClick(opportunity.url)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleRowClick(opportunity.url)
              }
            }}
          >
            <div className="opportunity-icon-wrapper">
              <img
                src={opportunity.icon}
                alt={opportunity.name}
                className="opportunity-icon"
              />
            </div>
            <span className="opportunity-name">{opportunity.name}</span>
            <svg
              className="opportunity-arrow"
              style={{ width: '1.25rem', height: '1.25rem', minWidth: '1.25rem', flexShrink: 0 }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        ))}
      </div>
    </main>
  )
}

