

"use client"

import { useState, useRef } from "react"
import { LogOut, ArrowLeft, Plus, Copy, Check, Save, Edit, Trash, Wallet } from "lucide-react"


export default function AccountsPage() {
  // State for account addresses
  const [accountAddresses, setAccountAddresses] = useState([
    {
      id: "1",
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      label: "Main Trading Wallet",
      category: "Wallet",
      isEditing: false,
    },
    {
      id: "2",
      address: "0x8Ba1f109551bD432803012645Ac136ddd64DBA72",
      label: "Binance Deposit Address",
      category: "Exchange",
      isEditing: false,
    },
  ])

  // State for new account form
  const [newAddress, setNewAddress] = useState("")
  const [newLabel, setNewLabel] = useState("")
  const [newCategory, setNewCategory] = useState("Wallet")

  // State for copy button
  const [copiedId, setCopiedId] = useState(null)

  // Ref for the new row
  const newAddressRef = useRef(null)

  // Function to handle copy
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  // Function to add new account address
  const addNewAddress = () => {
    if (newAddress.trim() && newLabel.trim()) {
      const newId = Date.now().toString()
      setAccountAddresses([
        ...accountAddresses,
        {
          id: newId,
          address: newAddress,
          label: newLabel,
          category: newCategory,
          isEditing: false,
        },
      ])
      setNewAddress("")
      setNewLabel("")
      setNewCategory("Wallet")

      // Focus on the address input after adding
      if (newAddressRef.current) {
        newAddressRef.current.focus()
      }
    }
  }

  // Function to toggle edit mode
  const toggleEditMode = (id) => {
    setAccountAddresses(
      accountAddresses.map((account) => 
        account.id === id ? { ...account, isEditing: !account.isEditing } : account
      )
    )
  }

  // Function to update account
  const updateAccount = (id, field, value) => {
    setAccountAddresses(
      accountAddresses.map((account) => 
        account.id === id ? { ...account, [field]: value } : account
      )
    )
  }

  // Function to save edits
  const saveEdits = (id) => {
    toggleEditMode(id)
  }

  // Function to delete account
  const deleteAccount = (id) => {
    setAccountAddresses(accountAddresses.filter((account) => account.id !== id))
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
      {/* Header */}
     

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
       
       <a href="/home">
        <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#c750f7] dark:hover:text-[#c750f7] transition-colors mb-6">
        <ArrowLeft className="w-8 h-6 text-[#c750f7]" />
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

        {/* Stats Cards */}
        

        {/* Add New Account Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#c750f7] to-purple-600 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Account</h2>
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
                disabled={!newAddress.trim() || !newLabel.trim()}
                className="w-full h-12 bg-gradient-to-r from-[#c750f7] to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Accounts List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-purple-100 dark:border-purple-900 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#c750f7]" />
              Your Labelled Adresses ({accountAddresses.length})
            </h2>
          </div>

          {accountAddresses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-10 h-10 text-[#c750f7]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Accounts Yet</h3>
              <p className="text-slate-600 dark:text-slate-400">Add your first crypto account to get started</p>
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
                  {accountAddresses.map((account) => (
                    <tr key={account.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        {account.isEditing ? (
                          <input
                            type="text"
                            value={account.address}
                            onChange={(e) => updateAccount(account.id, "address", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#c750f7]"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-slate-900 dark:text-white truncate max-w-xs">
                              {account.address}
                            </span>
                            <button
                              onClick={() => handleCopy(account.address, account.id)}
                              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                              title="Copy address"
                            >
                              {copiedId === account.id ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {account.isEditing ? (
                          <input
                            type="text"
                            value={account.label}
                            onChange={(e) => updateAccount(account.id, "label", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c750f7]"
                          />
                        ) : (
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {account.label}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {account.isEditing ? (
                          <select
                            value={account.category}
                            onChange={(e) => updateAccount(account.id, "category", e.target.value)}
                            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c750f7]"
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
                          {account.isEditing ? (
                            <button
                              onClick={() => saveEdits(account.id)}
                              className="inline-flex items-center gap-1 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-semibold hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                            >
                              <Save className="w-3.5 h-3.5" />
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleEditMode(account.id)}
                              className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => deleteAccount(account.id)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
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

      {/* Footer */}
      <footer className=" bg-white dark:bg-slate-900 border-t border-purple-200 dark:border-purple-900 py-12">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#c750f7] to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">CryptoSnoop</h4>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-2">Track your crypto journey with confidence</p>
          <p className="text-slate-500 dark:text-slate-500 text-sm">© 2025 CryptoSnoop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}