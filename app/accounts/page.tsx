"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Footer } from "@/components/footer"
import { Geist } from "next/font/google"
import { Geist_Mono as GeistMono } from "next/font/google"
import { LogOut, ArrowLeft, Plus, Copy, Check, Save, Edit, Trash } from "lucide-react"

// Initialize fonts
const geist = Geist({ subsets: ["latin"] })
const geistMono = GeistMono({ subsets: ["latin"] })

// Interface for account addresses
interface AccountAddress {
  id: string
  address: string
  description: string
  isEditing: boolean
}

export default function AccountsPage() {
  // State for account addresses
  const [accountAddresses, setAccountAddresses] = useState<AccountAddress[]>([
    {
      id: "1",
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      description: "My CryptoSnoop contract address",
      isEditing: false,
    },
  ])

  // State for new account form
  const [newAddress, setNewAddress] = useState("")
  const [newDescription, setNewDescription] = useState("")

  // State for copy button
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Ref for the new row
  const newAddressRef = useRef<HTMLInputElement>(null)

  // Function to handle copy
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  // Function to add new account address
  const addNewAddress = () => {
    if (newAddress.trim()) {
      const newId = Date.now().toString()
      setAccountAddresses([
        ...accountAddresses,
        {
          id: newId,
          address: newAddress,
          description: newDescription,
          isEditing: false,
        },
      ])
      setNewAddress("")
      setNewDescription("")

      // Focus on the address input after adding
      if (newAddressRef.current) {
        newAddressRef.current.focus()
      }
    }
  }

  // Function to toggle edit mode
  const toggleEditMode = (id: string) => {
    setAccountAddresses(
      accountAddresses.map((account) => (account.id === id ? { ...account, isEditing: !account.isEditing } : account)),
    )
  }

  // Function to update account
  const updateAccount = (id: string, field: "address" | "description", value: string) => {
    setAccountAddresses(
      accountAddresses.map((account) => (account.id === id ? { ...account, [field]: value } : account)),
    )
  }

  // Function to save edits
  const saveEdits = (id: string) => {
    toggleEditMode(id)
  }

  // Function to delete account
  const deleteAccount = (id: string) => {
    setAccountAddresses(accountAddresses.filter((account) => account.id !== id))
  }

  return (
    <main className={`min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 ${geist.className}`}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg sm:text-xl">C</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-primary font-bold text-base sm:text-lg leading-tight">crypto</span>
              <span className="text-slate-700 font-bold text-base sm:text-lg leading-tight -mt-1">Snoop</span>
            </div>
          </div>

          <Button variant="outline" size="sm" className="h-9 text-xs sm:text-sm" asChild>
            <Link href="/">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back to Home */}
        <div className="mb-4">
          <Link
            href="/home"
            className="inline-flex items-center text-sm text-slate-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        {/* Page Title */}
        {/* Commented out the Accounts section as requested */}
        {/* 
        <section className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Accounts</h1>
          <p className="text-slate-600">Manage your connected wallets and exchanges</p>
        </section>

        <section className="mb-6">
          <Button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition-all duration-300 shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Connect New Account
          </Button>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-700 mb-3">Connected Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accountsData.map((account) => (
              <Card key={account.id} className="border-0 shadow-[0_8px_15px_-3px_rgba(182,111,235,0.2)]">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-base">
                    <Wallet className="w-5 h-5 mr-2 text-primary" />
                    {account.name}
                    <span className="ml-2 text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">
                      {account.type}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-600 mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span>Address/ID:</span>
                      <span className="font-mono">{account.address}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last synced:</span>
                      <span>{account.lastSync}</span>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm" className="text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        */}

        {/* Manage Crypto Accounts Section with improved visual hierarchy */}
        <section className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">Manage Your Crypto Accounts</h1>
          <p className="text-lg text-slate-700 mb-2">Store and manage your crypto addresses for easy access</p>
          <p className="text-sm text-slate-500 italic mb-6">
            e.g., Save your wallet addresses, smart contract addresses, or exchange deposit addresses
          </p>

          {/* Account Addresses Table */}
          <Card className="border-0 shadow-[0_8px_15px_-3px_rgba(182,111,235,0.2)] mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 text-base font-semibold text-slate-800">Account Address</th>
                      <th className="text-left py-3 text-base font-semibold text-slate-800">Description</th>
                      <th className="text-right py-3 text-base font-semibold text-slate-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountAddresses.map((account) => (
                      <tr key={account.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-4 pr-4 w-1/2">
                          {account.isEditing ? (
                            <Input
                              value={account.address}
                              onChange={(e) => updateAccount(account.id, "address", e.target.value)}
                              className={`font-mono text-sm ${geistMono.className}`}
                            />
                          ) : (
                            <div className="flex items-center">
                              <span
                                className={`font-mono text-sm truncate ${geistMono.className} text-slate-800 font-medium`}
                              >
                                {account.address}
                              </span>
                              <button
                                onClick={() => handleCopy(account.address, account.id)}
                                className="ml-2 text-slate-400 hover:text-primary transition-colors"
                                aria-label="Copy address"
                              >
                                {copiedId === account.id ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="py-4 pr-4 w-1/3">
                          {account.isEditing ? (
                            <Input
                              value={account.description}
                              onChange={(e) => updateAccount(account.id, "description", e.target.value)}
                              className="text-sm"
                            />
                          ) : (
                            <span className="text-sm text-slate-700 font-medium">{account.description}</span>
                          )}
                        </td>
                        <td className="py-4 text-right whitespace-nowrap">
                          {account.isEditing ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => saveEdits(account.id)}
                              className="h-8 px-3 text-xs font-medium"
                            >
                              <Save className="h-3.5 w-3.5 mr-1" />
                              Save
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleEditMode(account.id)}
                              className="h-8 px-3 text-xs font-medium"
                            >
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAccount(account.id)}
                            className="h-8 px-3 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Add New Account Address Form */}
          <Card className="border-0 shadow-[0_8px_15px_-3px_rgba(182,111,235,0.2)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-slate-800">Add New Account Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5">
                  <label htmlFor="account-address" className="block text-sm font-semibold text-slate-700 mb-1">
                    Account Address
                  </label>
                  <Input
                    id="account-address"
                    ref={newAddressRef}
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="0x..."
                    className={`font-mono ${geistMono.className}`}
                  />
                </div>
                <div className="md:col-span-5">
                  <label htmlFor="account-description" className="block text-sm font-semibold text-slate-700 mb-1">
                    Description
                  </label>
                  <Input
                    id="account-description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="My wallet address..."
                  />
                </div>
                <div className="md:col-span-2">
                  <Button
                    onClick={addNewAddress}
                    className="w-full bg-primary hover:bg-primary/90 font-medium"
                    disabled={!newAddress.trim()}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}
