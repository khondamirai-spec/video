'use client'

import Link from 'next/link'

interface Platform {
    id: string
    name: string
    icon: string
    url: string
}

const platforms: Platform[] = [
    {
        id: '17',
        name: 'Upwork',
        icon: '/ICONS/Screenshot 2026-02-07 162153.png',
        url: 'https://www.upwork.com',
    },
    {
        id: '18',
        name: 'Fiverr',
        icon: '/ICONS/Screenshot 2026-02-07 162215.png',
        url: 'https://www.fiverr.com',
    },
    {
        id: '19',
        name: 'Toptal',
        icon: '/ICONS/Screenshot 2026-02-07 162231.png',
        url: 'https://www.toptal.com',
    },
    {
        id: '20',
        name: 'Freelancer.com',
        icon: '/ICONS/Screenshot 2026-02-07 162257.png',
        url: 'https://www.freelancer.com',
    },
    {
        id: '21',
        name: 'Guru',
        icon: '/ICONS/Screenshot 2026-02-07 162322.png',
        url: 'https://www.guru.com',
    },
]

export default function FreelancingPage() {
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

            <h1 className="opportunities-title">Freelancing</h1>

            <div className="opportunities-container">
                {platforms.map((platform) => (
                    <div
                        key={platform.id}
                        className="opportunity-row"
                        onClick={() => handleRowClick(platform.url)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleRowClick(platform.url)
                            }
                        }}
                    >
                        <div className="opportunity-icon-wrapper">
                            <img
                                src={platform.icon}
                                alt={platform.name}
                                className="opportunity-icon"
                            />
                        </div>
                        <span className="opportunity-name">{platform.name}</span>
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
