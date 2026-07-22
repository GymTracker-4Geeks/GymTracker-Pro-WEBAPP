import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import FAQ from '@/components/landing/FAQ'
import CTAFinal from '@/components/landing/CTAFinal'

export default function Page() {
    return (
        <main>
            <Navbar />
            <Hero />
            <Features />
            <FAQ />
            <CTAFinal />
        </main>
    )
}
