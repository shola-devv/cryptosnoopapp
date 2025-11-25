"use client"


import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useState, useRef, useEffect } from "react"
import { LogOut, ArrowLeft, Plus, Copy, Check, Save, Edit, Trash, Wallet } from "lucide-react"
import Image from "next/image"
import { usePortfolio } from "@/hooks/usePortfolio"
import { signOut } from "next-auth/react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { SlotInfo } from "@/components/slotInfo";

export default function AccountsPage() {
 const { data: session, status } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;
  const name = session?.user?.name;
  const userPlan = session?.user?.subscription?.plan || "free";
  const maxAssets = userPlan === "free" ? 10 : 50;

  const { addresses, refreshAddresses, refreshAll, isLoading, error } = usePortfolio()
  
  // State for new account form
  const [newAddress, setNewAddress] = useState("")
  const [newLabel, setNewLabel] = useState("")
  const [newCategory, setNewCategory] = useState("Wallet")

  // State for copy button
  const [copiedId, setCopiedId] = useState(null)

  // State for editing
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

  // State for messages
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [isSending, setIsSending] = useState(false)

  // Ref for the new row
  const newAddressRef = useRef(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);


  //fetch subscription data, maybe work with addresses refresh
  useEffect(() => {
    if (!userId) return;
  
    fetch(`/api/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUserPlan(data?.subscription?.plan || "free");
      })
      .catch(() => {});
  }, [userId]);


  
  const buzzClick = () => {
    if(navigator.vibrate) {
      navigator.vibrate(100)
    }
  }

  // Function to handle copy
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      buzzClick()
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

//fetch sub data
useEffect(() => {
  if (!userId) return;

  fetch(`/api/user/${userId}`)
    .then(res => res.json())
    .then(data => {
      setUserPlan(data?.subscription?.plan || "free");
    })
    .catch(() => {});
}, [userId]);

  // Function to add new account address
  const addNewAddress = async () => {
    if (!newAddress.trim() || !newLabel.trim()) return

if (addresses.length >= maxAddresses) {
    setMessage(`You have reached your limit of ${maxAddresses} address slots.`);
    setMessageType("error");
    alert(`Maximum asset limit reached. Upgrade to add more.`);
    return;
  }

    setMessage("")
    setMessageType("")
    setIsSending(true)

    try {
      const response = await fetch(`/api/addresses?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: newAddress,
          label: newLabel,
          category: newCategory,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add address")
      }

      setMessage("Address added successfully!")
      setMessageType("success")
      setNewAddress("")
      setNewLabel("")
      setNewCategory("Wallet")
      await refreshAddresses()
      setTimeout(() => {alert('Address added successfully!')}, 3000);
      buzzClick()
      
      // Focus on the address input after adding
      if (newAddressRef.current) {
        newAddressRef.current.focus()
      }
    } catch (error) {
      console.error(error)
      setMessage("")
      setMessageType("error")
      alert('Failed to add address. Please try again.')
    } finally {
      setIsSending(false)
      setTimeout(() => setMessage(""), 3000)
    }
  }

  // Function to toggle edit mode
  const toggleEditMode = (id, address, label, category) => {
    if (editingId === id) {
      setEditingId(null)
      setEditData({})
    } else {
      setEditingId(id)
      setEditData({ address, label, category })
    }
  }

  // Function to update edit data
  const updateEditData = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  // Function to save edits
  const saveEdits = async (id) => {
    if (!editData.address?.trim() || !editData.label?.trim()) return

    setMessage("")
    setMessageType("")
    setIsSending(true)

    try {
      const response = await fetch(`/api/addresses/${id}?userId=${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: editData.address,
          label: editData.label,
          category: editData.category,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update address")
      }

      setMessage("")
      setMessageType("success")
      setEditingId(null)
      setEditData({})
      await refreshAddresses()
       setTimeout(() => {alert('Address updated successfully!')}, 3000);
      buzzClick()
      
    } catch (error) {
      console.error(error)
      setMessage("Failed to update address. Please try again.")
      setMessageType("error")
      alert('Failed to update address. Please try again.')
    } finally {
      setIsSending(false)
      setTimeout(() => setMessage(""), 3000)
    }
  }

  // Function to delete account
  const deleteAccount = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return

    setMessage("")
    setMessageType("")
    setIsSending(true)

    try {
      const response = await fetch(`/api/addresses/${id}?userId=${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete address")
      }

      setMessage("")
      setMessageType("success")
      await refreshAddresses()
      buzzClick();
       setTimeout(() => {alert('Address deleted successfully!')}, 3000);

    } catch (error) {
      console.error(error)
      setMessage("Failed to delete address. Please try again.")
      setMessageType("error")
       setTimeout(() => {alert("Failed to delete address. Please try again.")}, 3000);
    } finally {
      setIsSending(false)
      setTimeout(() => setMessage(""), 3000)
    }
  }

  // Get category badge color
  const getCategoryColor = (category) => {
    const colors = {
      Wallet: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      Exchange: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Contract: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      Other: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400"
    }
    return colors[category] || colors.Other
  }

  if (isLoading) {
    return (
     <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
                   <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                     <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                       <div className="flex items-center gap-2 sm:gap-4">
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
                               className="font-bold text-sm sm:text-lg leading-tight"
                               style={{ color: "#c750f7" }}
                             >
                               crypto
                             </span>
                             <span className="text-slate-700 dark:text-slate-300 font-bold text-sm sm:text-lg leading-tight -mt-1">
                               Snoop
                             </span>
                           </div>
                         </div>
                       </div>
                     </div>
                   </header>
           
                   <div className="flex justify-center mt-20 sm:mt-24 lg:mt-28">
                     <div className="w-16 h-16 border-4 border-[#c750f7] border-t-transparent rounded-full animate-spin"></div>
                   </div>
           
                   <footer className="mt-[60vh] bg-white text-gray-900 py-12 relative z-10">
                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                       <div className="flex items-center justify-center gap-6 mb-6">
                         <a
                           href="/home/privacy"
                           className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
                         >
                           privacy policy
                         </a>
                         <a
                           href="/home/help"
                           className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
                         >
                           Help
                         </a>
                         <a
                           href={`https://twitter.com/intent/follow?screen_name=${`cryptosnoop_app`}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
                         >
                           our socials
                         </a>
                         <a
                           href="#logout"
                           className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
                         >
                           Logout
                         </a>
                       </div>
                       <div className="flex items-center justify-center gap-3 mb-4">
                         <div className="w-12 h-12 flex items-center justify-center">
                           <Image
                             src="/cryptosnooplogo1.png"
                             alt="DIVAFlex Logo"
                             width={48}
                             height={32}
                             className="object-contain"
                             priority
                           />
                         </div>
                         <h4 className="text-xl font-bold">CryptoSnoop.app</h4>
                       </div>
                       <p className="text-slate-600 dark:text-slate-400 mb-2">
                         Track your crypto journey with confidence
                       </p>
                       <p className="text-gray-600">
                         © 2025 CryptoSnoop. All rights reserved.
                       </p>
                     </div>
                   </footer>
                 </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
                    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-4">
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
                                className="font-bold text-sm sm:text-lg leading-tight"
                                style={{ color: "#c750f7" }}
                              >
                                crypto
                              </span>
                              <span className="text-slate-700 dark:text-slate-300 font-bold text-sm sm:text-lg leading-tight -mt-1">
                                Snoop
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </header>
            
                    <div className="mt-20 sm:mt-12 lg:mt-32">
                      <div className="text-center">
                        <p className="text-black mb-4">Error connecting</p>
                        <Button
                          onClick={refreshAll}
                          style={{ backgroundColor: "#c750f7" }}
                          className="text-white"
                        >
                          Retry
                        </Button>
                      </div>
                    </div>
            
                    <footer className="mt-[60vh] bg-white text-gray-900 py-12 relative z-10">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="flex items-center justify-center gap-6 mb-6">
                          <a
                            href="/home/privacy"
                            className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
                          >
                            privacy policy
                          </a>
                          <a
                            href="/home/help"
                            className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
                          >
                            Help
                          </a>
                          <a
                            href={`https://twitter.com/intent/follow?screen_name=${`cryptosnoop_app`}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
                          >
                            our socials
                          </a>
                          <a
                            href="#logout"
                            className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline"
                          >
                            Logout
                          </a>
                        </div>
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <div className="w-12 h-12 flex items-center justify-center">
                            <Image
                              src="/cryptosnooplogo1.png"
                              alt="DIVAFlex Logo"
                              width={48}
                              height={32}
                              className="object-contain"
                              priority
                            />
                          </div>
                          <h4 className="text-xl font-bold">CryptoSnoop.app</h4>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mb-2">
                          Track your crypto journey with confidence
                        </p>
                        <p className="text-gray-600">
                          © 2025 CryptoSnoop. All rights reserved.
                        </p>
                      </div>
                    </footer>
                  </main>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <a href="/home">
          <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#c750f7] dark:hover:text-[#c750f7] transition-colors mb-6">
            <ArrowLeft className="w-8 h-8 text-[#c750f7]" />
          </button>
        </a>
         
        {/* Page Header */}
        <div className="mb-10">
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
            label and organize your crypto addresses for quick access
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 italic">
            Store wallet addresses, smart contract addresses, exchange deposit addresses, and more
          </p>
        </div>

 <SlotInfo
      used={addresses.length}
      max={maxAddresses}
      isFree={userPlan === "free"}
      onUpgrade={() => router.push("/home/upgrade")}
    />
        {/* Success/Error Message */}
        {message && (
          <div
            className={`mb-6 text-center font-semibold py-3 rounded-lg ${
              messageType === 'success'
                ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'
            }`}
          >
            {message}
          </div>
        )}

        {/* Add New Account Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#c750f7] rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Address</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Account Address
              </label>
              <input
                ref={newAddressRef}
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#c750f7] focus:border-transparent transition-all"
                disabled={isSending}
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Label / Description
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Main Trading Wallet"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c750f7] focus:border-transparent transition-all"
                disabled={isSending}
                maxLength={40}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c750f7] focus:border-transparent transition-all"
                disabled={isSending}
              >
                <option value="Wallet">Wallet</option>
                <option value="Exchange">Exchange</option>
                <option value="Contract">Contract</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-transparent mb-2">Add</label>
              <button
                onClick={addNewAddress}
                disabled={!newAddress.trim() || !newLabel.trim() || isSending}
                className="w-full h-12 bg-[#c750f7] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Accounts List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-purple-100 dark:border-purple-900 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#c750f7]" />
              Your Labelled Addresses ({addresses?.length || 0})
            </h2>
          </div>

          {!addresses || addresses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-10 h-10 text-[#c750f7]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Addresses Yet</h3>
              <p className="text-slate-600 dark:text-slate-400">Add your first address to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">Address</th>
                    <th className="text-left px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">Label</th>
                    <th className="text-left px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">Category</th>
                    <th className="text-right px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {addresses.map((account) => (
                    <tr key={account._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        {editingId === account._id ? (
                          <input
                            type="text"
                            value={editData.address}
                            onChange={(e) => updateEditData("address", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#c750f7]"
                            disabled={isSending}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-slate-900 dark:text-white truncate max-w-xs">
                              {account.address}
                            </span>
                            <button
                              onClick={() => handleCopy(account.address, account._id)}
                              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                              title="Copy address"
                            >
                              {copiedId === account._id ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {editingId === account._id ? (
                          <input
                            type="text"
                            value={editData.label}
                            onChange={(e) => updateEditData("label", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c750f7]"
                            disabled={isSending}
                          />
                        ) : (
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {account.label}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {editingId === account._id ? (
                          <select
                            value={editData.category}
                            onChange={(e) => updateEditData("category", e.target.value)}
                            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c750f7]"
                            disabled={isSending}
                          >
                            <option value="Wallet">Wallet</option>
                            <option value="Exchange">Exchange</option>
                            <option value="Contract">Contract</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(account.category)}`}>
                            {account.category}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {editingId === account._id ? (
                            <button
                              onClick={() => saveEdits(account._id)}
                              disabled={isSending}
                              className="inline-flex items-center gap-1 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-semibold hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50"
                            >
                              {isSending ? (
                                <div className="w-3.5 h-3.5 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <>
                                  <Save className="w-3.5 h-3.5" />
                                  Save
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleEditMode(account._id, account.address, account.label, account.category)}
                              disabled={isSending}
                              className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => deleteAccount(account._id)}
                            disabled={isSending}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                          >
                            <Trash className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <p className="text-center text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium mt-4">
         For your safety, never share or store passwords, private keys, or seed phrases here.
      </p>
      {/* Footer */}
     <footer className="mt-8 bg-white text-gray-900 py-12 relative z-10 dark:bg-slate-900/60">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
               <div className="flex items-center justify-center gap-6 mb-6">
                 <a href="/home/privacy" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white">privacy policy</a>
                 <a href="/home/help" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white">Help</a>
                  <a href={`https://twitter.com/intent/follow?screen_name=${`cryptosnoop_app`}`} target="_blank" rel="noopener noreferrer dark:text-white" className="text-gray-600 hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white" >our socials</a>
                 <a  onClick={() => signOut({ callbackUrl: "/" })} className="text-gray-600 cursor-pointer hover:text-[#c750f7] transition-colors duration-300 font-medium underline dark:text-white">Logout</a>
               </div>
               <div className="flex items-center justify-center gap-3 mb-4">
               <div className="w-12 h-12 flex items-center justify-center">
                       <Image
                         src="/cryptosnooplogo1.png"
                         alt="cryptosnooplogo Logo"
                         width={48}
                         height={32}
                         className="object-contain"
                         priority
                       />
                     </div>
                 <h4 className="text-xl font-bold dark:text-white">CryptoSnoop.app</h4>
               </div>
               <p className="text-slate-600 dark:text-white">Track your crypto journey with confidence</p>
               <p className="text-gray-600 dark:text-white">© {new Date().getFullYear()} CryptoSnoop. All rights reserved.</p>
             </div>
           </footer>
    
      
    </div>
  )
}