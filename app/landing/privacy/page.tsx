"use client";

import React from 'react';
import Image from "next/image";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="fixed top-0 w-full bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/cryptosnooplogo1.png"
              alt="CryptoSnoop Logo"
              width={48}
              height={32}
              className="object-contain"
              priority
            />

            <div className="flex flex-col leading-none">
              <span
                className="font-bold text-sm sm:text-lg md:text-xl leading-tight"
                style={{ color: "#c750f7" }}
              >
                crypto
              </span>
              <span className="text-slate-700 dark:text-slate-300 font-bold text-sm sm:text-lg md:text-xl leading-tight -mt-1">
                Snoop
              </span>
            </div>
          </div>

          {/* Back button */}
          <a
            href="/landing"
            className="px-6 py-2 rounded-lg underline text-black hover:text-[#d575fc] text-sm sm:text-base md:text-lg"
          >
            Back
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          
          <h1 className="font-bold text-3xl sm:text-5xl md:text-6xl text-black mb-4">
            Privacy Policy
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#c750f7]">
            Last updated: {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose max-w-none">

          {/* Introduction */}
          <section className="mb-12">
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg mb-6">
              At CryptoSnoop, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cryptocurrency portfolio tracking service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the web application.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black mb-6">
              Information We Collect
            </h2>

            <h3 className="text-xl sm:text-3xl md:text-4xl font-semibold text-black mt-8 mb-4">
              Personal Information
            </h3>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              We may collect personal information that you voluntarily provide to us when you register on the application, including:
            </p>

            <ul className="list-disc pl-6 text-gray-700 text-sm sm:text-base md:text-lg space-y-2 mb-6">
              <li>Email address</li>
              <li>Username</li>
              <li>Password (encrypted)</li>
              <li>Profile information</li>
            </ul>

            {/* Crypto Data */}
            <h3 className="text-xl sm:text-3xl md:text-4xl font-semibold text-black mt-8 mb-4">
              Cryptocurrency Data
            </h3>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              To provide our services, we collect and store:
            </p>

            <ul className="list-disc pl-6 text-gray-700 text-sm sm:text-base md:text-lg space-y-2 mb-6">
              <li>Wallet addresses you choose to track</li>
              <li>Custom labels for your wallets</li>
              <li>Transaction history (public blockchain data)</li>
              <li>Portfolio preferences and settings</li>
            </ul>

            {/* Auto Data */}
            <h3 className="text-xl sm:text-3xl md:text-4xl font-semibold text-black mt-8 mb-4">
              Automatically Collected Information
            </h3>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              When you access our service, we automatically collect certain information, including:
            </p>

            <ul className="list-disc pl-6 text-gray-700 text-sm sm:text-base md:text-lg space-y-2 mb-6">
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          {/* How We Use Info */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black mb-6">
              How We Use Your Information
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              We use the information we collect to:
            </p>

            <ul className="list-disc pl-6 text-gray-700 text-sm sm:text-base md:text-lg space-y-2 mb-6">
              <li>Provide, operate, and maintain our cryptocurrency tracking service</li>
              <li>Display real-time portfolio data and analytics</li>
              <li>Improve and personalize your user experience</li>
              <li>Communicate with you about updates, security alerts, and support</li>
              <li>Monitor and analyze usage patterns to enhance our service</li>
              <li>Detect and prevent fraudulent activity</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black mb-6">
              Data Security
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              We implement industry-standard security measures to protect your personal information:
            </p>

            <ul className="list-disc pl-6 text-gray-700 text-sm sm:text-base md:text-lg space-y-2 mb-6">
              <li>End-to-end encryption for sensitive data</li>
              <li>SSL secure communication</li>
              <li>Regular security audits</li>
              <li>Password hashing and salting</li>
              <li>Restricted employee access</li>
            </ul>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              However, no method of storage or transmission online is 100% secure.
            </p>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black mb-6">
              Information Sharing and Disclosure
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              We do not sell or rent your personal information. We may share data only in these cases:
            </p>

            <ul className="list-disc pl-6 text-gray-700 text-sm sm:text-base md:text-lg space-y-2 mb-6">
              <li><strong>Service Providers:</strong> Hosting, analytics, backend services.</li>
              <li><strong>Legal Requirements:</strong> If required by law or court order.</li>
              <li><strong>Business Transfers:</strong> During acquisitions or mergers.</li>
              <li><strong>With Your Consent:</strong> Only when explicitly approved.</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black mb-6">
              Data Retention
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              We retain your personal information only as long as necessary. Upon deletion of your account, data is erased or anonymized within 30 days.
            </p>
          </section>

          {/* Rights */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black mb-6">
              Your Privacy Rights
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              Depending on your region, you may have rights such as:
            </p>

            <ul className="list-disc pl-6 text-gray-700 text-sm sm:text-base md:text-lg space-y-2 mb-6">
              <li>Access your personal data</li>
              <li>Request corrections</li>
              <li>Request deletion</li>
              <li>Data portability</li>
              <li>Object to processing</li>
              <li>Withdraw consent</li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black mb-6">
              Cookies and Tracking Technologies
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              We use cookies to enhance your experience. You may disable cookies through your browser settings.
            </p>
          </section>

          {/* Third Party */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black mb-6">
              Third-Party Links
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              We are not responsible for external sites linked from our platform.
            </p>
          </section>

          {/* Changes */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black mb-6">
              Changes to This Privacy Policy
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              We may update this policy occasionally. Continued use of our service indicates acceptance.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black mb-6">
              Contact Us
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              If you have any questions,{" "}
              <span
                onClick={() => {
                  window.location.href =
                    'mailto:cryptosnoop@gmail.com?subject=Feedback&body=Hello Cryptosnoop Team,%0D%0A%0D%0AHere is my feedback...';
                }}
                className="cursor-pointer text-[#c750f7] underline font-medium"
              >
                contact us
              </span>
              .
            </p>
          </section>

          {/* Disclaimer */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black mb-6">
              Disclaimer
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              Nothing on this application is financial advice. Always do your own research.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
