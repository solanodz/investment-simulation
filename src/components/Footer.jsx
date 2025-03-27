"use client"

import Image from 'next/image';
import { useDonation } from '@/hooks/useDonation';
import Link from 'next/link';

// Component for social links
const SocialLink = ({ href, children }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary transition-colors"
    >
        {children}
    </a>
);

// Component for donation options
const DonationOption = ({ icon, text, onClick, status, customClass }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-full 
                  opacity-100 transition-all bg-primary/10 hover:bg-primary/20  ${customClass}`}
        title={`Contribute with ${text}`}
    >
        {icon}
        <span className="text-[10px] whitespace-nowrap">
            {status || text}
        </span>
    </button>
);

export function Footer() {
    const ethAddress = '0x3A9F9baD8bd40F6369d378557D4BA528f61C24DE';
    const { donationStatus, handleDonation, getStatusText } = useDonation(ethAddress);

    return (
        <footer className="w-full border-t border-border/40 bg-background py-2">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Left side */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                Developed by{' '}
                                <a
                                    href="https://solanodz.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    solanodz
                                    <span className="relative inline-block mx-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 14"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M7 17L17 7"></path>
                                            <path d="M7 7h10v10"></path>
                                        </svg>
                                    </span>
                                </a>
                            </span>
                            <div className="h-5 w-px bg-muted-foreground mx-1" />

                            <div className="flex items-center gap-2">
                                <SocialLink href="https://github.com/solanodz">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                                        <path d="M9 18c-4.51 2-5-2-7-2"></path>
                                    </svg>
                                </SocialLink>
                                <SocialLink href="https://x.com/solanodzf">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                    </svg>
                                </SocialLink>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                            <span>Data provided by</span>
                            <Link href="https://binance.com" target="_blank" rel="noopener noreferrer">
                                <Image src="/Binance_Logo.webp" alt="Binance" width={14} height={14} />
                            </Link>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 flex-col ">
                            <span className="text-xs text-muted-foreground">Collaborate with</span>
                            <div className="flex items-center gap-2">
                                <DonationOption
                                    icon={<Image src="/MetaMask-icon-Fox.svg" alt="MetaMask" width={16} height={16} />}
                                    text="ETH"
                                    onClick={handleDonation}
                                    status={donationStatus ? getStatusText() : null}
                                    customClass={
                                        donationStatus === 'success' ? 'text-green-500' :
                                            donationStatus === 'error' ? 'text-red-500' :
                                                donationStatus === 'cancelled' ? 'text-amber-500' :
                                                    'text-muted-foreground'
                                    }
                                />
                                <DonationOption
                                    icon={
                                        <Image src="/cafecito_logo.svg" alt="Cafecito" width={18} height={18} />
                                    }
                                    text="Cafecito"
                                    onClick={() => window.open('https://cafecito.app/solanodz', '_blank')}
                                    customClass="text-muted-foreground"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
} 