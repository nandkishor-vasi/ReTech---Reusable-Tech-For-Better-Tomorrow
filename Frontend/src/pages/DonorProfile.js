import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { useParams } from "react-router-dom"
import { Upload, Save, X, Edit, MapPin, Flag, Globe } from "lucide-react"

export default function Profile() {
  const {user } = useAuth()
  const token = user?.token
  const donorId  = user?.id;
  const backendBaseUrl = process.env.BACKEND_BASE_URL;
  const [donor, setDonor] = useState(null)
  const [profile, setProfile] = useState({
    profileImageUrl: "",
    city: "",
    state: "",
    country: "",
    donationCount: 0,
    donorType: "",
    notes: "",
  })

  const [editing, setEditing] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (donorId) {
      fetchDonorProfile()
    }
  }, [donorId])

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreviewUrl(null)
    }
  }, [selectedFile])

  const fetchDonorProfile = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${backendBaseUrl}/api/donors/${donorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProfile(response.data)
      setDonor(response.data)
    } catch (error) {
      console.error("Error fetching donor profile:", error)
      showToast("Error", "Failed to fetch donor profile", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const showToast = (title, message, type = "success") => {
    alert(`${title}: ${message}`)
  }

  const handleSave = async () => {
    setIsLoading(true)
    const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
    const cloudinaryUploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET

    try {
      const updatedData = { ...profile }

      if (selectedFile) {
        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("upload_preset", cloudinaryUploadPreset || "")

        try {
          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
            formData,
          )

          const imageUrl = response.data.secure_url
          showToast("Success", "Image uploaded to cloud successfully!")

          console.log("Image URL:", imageUrl)
          console.log("token:", token);
          await axios.put(
            `${backendBaseUrl}/api/donors/${donorId}/updateImage`,
            { profileImageUrl: imageUrl },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          )

          setProfile({ ...profile, profileImageUrl: imageUrl })
          showToast("Success", "Profile image updated successfully!")
        } catch (error) {
          console.error("Error uploading image:", error)
          showToast("Error", "Failed to upload image", "error")
        }
      }

      await axios.put(`${backendBaseUrl}/api/donors/${donorId}/profile`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      setProfile(updatedData)
      setEditing(false)
      setSelectedFile(null)
      showToast("Success", "Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      showToast("Error", "Failed to update profile", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setSelectedFile(null)
    setPreviewUrl(null)
    fetchDonorProfile()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="text-center p-6 bg-gray-50 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Donor Profile</h1>
          <p className="text-gray-600">View and manage your donor information</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                <img
                  src={
                    previewUrl ||
                    profile.profileImageUrl ||
                    "https://cdn-icons-png.flaticon.com/512/8847/8847419.png" ||
                    "/placeholder.svg"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              {editing && (
                <div className="absolute -bottom-2 -right-2">
                  <label htmlFor="profile-image" className="cursor-pointer">
                    <div className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                      <Upload size={16} />
                    </div>
                  </label>
                  <input
                    id="profile-image"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              )}
            </div>

            {selectedFile && <p className="text-sm text-gray-500">Selected: {selectedFile.name}</p>}
          </div>

          {/* User Information Section */}
          <div className="grid gap-6 md:grid-cols-2 pt-6 border-t mt-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                value={donor?.user?.name || ""}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                value={donor?.user?.username || ""}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={donor?.user?.email || ""}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={donor?.user?.phone || ""}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                value={donor?.user?.address || ""}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                id="role"
                value={donor?.user?.role || ""}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="joined" className="block text-sm font-medium text-gray-700">
                Joined At
              </label>
              <input
                id="joined"
                value={donor?.user?.createdAt ? new Date(donor.user.createdAt).toLocaleDateString() : ""}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700"
              />
            </div>
          </div>

          {/* Donor Profile Information */}
          <div className="grid gap-6 md:grid-cols-2 pt-6 border-t mt-6">
            <div className="space-y-2">
              <label htmlFor="city" className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <MapPin size={16} /> City
              </label>
              <input
                id="city"
                name="city"
                value={profile.city}
                onChange={handleChange}
                disabled={!editing || isLoading}
                placeholder="Enter your city"
                className={`w-full px-3 py-2 border rounded-md ${
                  !editing || isLoading ? "bg-gray-100" : "bg-white"
                } border-gray-300 text-gray-700`}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="state" className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <Flag size={16} /> State
              </label>
              <input
                id="state"
                name="state"
                value={profile.state}
                onChange={handleChange}
                disabled={!editing || isLoading}
                placeholder="Enter your state"
                className={`w-full px-3 py-2 border rounded-md ${
                  !editing || isLoading ? "bg-gray-100" : "bg-white"
                } border-gray-300 text-gray-700`}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="country" className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <Globe size={16} /> Country
              </label>
              <input
                id="country"
                name="country"
                value={profile.country}
                onChange={handleChange}
                disabled={!editing || isLoading}
                placeholder="Enter your country"
                className={`w-full px-3 py-2 border rounded-md ${
                  !editing || isLoading ? "bg-gray-100" : "bg-white"
                } border-gray-300 text-gray-700`}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="donationCount" className="block text-sm font-medium text-gray-700">
                Donation Count
              </label>
              <input
                id="donationCount"
                name="donationCount"
                type="number"
                value={profile.donationCount}
                disabled={true}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="donorType" className="block text-sm font-medium text-gray-700">
                Donor Type
              </label>
              <select
                id="donorType"
                name="donorType"
                value={profile.donorType}
                onChange={handleSelectChange}
                disabled={!editing || isLoading}
                className={`w-full px-3 py-2 border rounded-md ${
                  !editing || isLoading ? "bg-gray-100" : "bg-white"
                } border-gray-300 text-gray-700`}
              >
                <option value="">Select donor type</option>
                <option value="INDIVIDUAL">Individual</option>
                <option value="ORGANIZATION">Organization</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={profile.notes}
                onChange={handleChange}
                disabled={!editing || isLoading}
                placeholder="Add any additional notes here"
                className={`w-full px-3 py-2 border rounded-md ${
                  !editing || isLoading ? "bg-gray-100" : "bg-white"
                } border-gray-300 text-gray-700 min-h-[100px]`}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-6 bg-gray-50 border-t">
          {editing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex items-center gap-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save size={16} /> Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Edit size={16} /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
