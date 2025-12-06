"use client"

import React from 'react';
import Image from "next/image"

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/cryptosnooplogo1.png"
              alt="DIVAFlex Logo"
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
            href="/home"
            className="px-6 py-2 rounded-lg underline text-sm sm:text-base md:text-lg text-black hover:text-[#d575fc]"
          >
            Back
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">

          {/* Hero title */}
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
            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
              At CryptoSnoop, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cryptocurrency portfolio tracking service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the web application.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black m-0 mb-6">
              Information We Collect
            </h2>

            <h3 className="font-semibold text-xl sm:text-3xl md:text-4xl text-black mt-8 mb-4">
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

            <h3 className="font-semibold text-xl sm:text-3xl md:text-4xl text-black mt-8 mb-4">
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

            <h3 className="font-semibold text-xl sm:text-3xl md:text-4xl text-black mt-8 mb-4">
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

          {/* How We Use Your Information */}
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
              <li>Detect, prevent, and address technical issues or fraudulent activity</li>
              <li>Comply with legal obligations and enforce our terms of service</li>
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
              <li>Secure socket layer (SSL) technology</li>
              <li>Regular security audits and updates</li>
              <li>Password hashing and salting</li>
              <li>Limited employee access to personal data</li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black mb-6">
              Information Sharing and Disclosure
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 text-sm sm:text-base md:text-lg space-y-2 mb-6">
              <li><strong>Service Providers:</strong> We may share data with trusted third-party service providers who assist in operating our platform (e.g., cloud hosting, analytics)</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or government request</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
              <li><strong>With Your Consent:</strong> We may share information for any other purpose with your explicit consent</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black mb-6">Data Retention</h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. When you delete your account, we will delete or anonymize your personal information within 30 days.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black mb-6">
              Your Privacy Rights
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 text-sm sm:text-base md:text-lg space-y-2 mb-6">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Objection:</strong> Object to processing of your personal information</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent at any time where we rely on consent</li>
            </ul>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              To exercise any of these rights, please contact us using the information provided below.
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black mb-6">
              Cookies and Tracking Technologies
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings. However, disabling cookies may affect the functionality of our service.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black mb-6">
              Third-Party Links
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              Our service may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black mb-6">
              Changes to This Privacy Policy
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Continued use of our service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black m-0 mb-6">
              Contact Us
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              If you have any questions or concerns about this Privacy Policy or our data practices,&nbsp;
              <span
                onClick={() => {
                  window.location.href =
                    'mailto:cryptosnoopapp@gmail.com?subject=Feedback&body=Hello Cryptosnoop Team,%0D%0A%0D%0AHere is my feedback...';
                }}
                className="cursor-pointer text-[#c750f7] transition-colors duration-300 font-medium underline"
              >
                contact us
              </span>
            </p>
          </section>

          {/* Disclaimer */}
          <section className="mb-12">
            <h2 className="font-bold text-2xl sm:text-4xl md:text-5xl text-black mb-6">
              Disclaimer
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              No part of the content on this web application provides financial advice. Any use or reliance on our content for any purpose is solely at your own risk and discretion. You should conduct your own research, review, analyse and verify our content before relying on them.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

