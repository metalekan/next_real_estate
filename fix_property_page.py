import sys

# Read the file
with open(sys.argv[1], 'r', encoding='utf-8') as f:
    content = f.read()

# Add InquiryForm import after FavoriteButton
content = content.replace(
    "import FavoriteButton from '@/components/properties/FavoriteButton';\nimport Header from '@/components/layout/Header';",
    "import FavoriteButton from '@/components/properties/FavoriteButton';\nimport InquiryForm from '@/components/properties/InquiryForm';\nimport Header from '@/components/layout/Header';"
)

# Remove showContactForm state
content = content.replace(
    "  const [currentImageIndex, setCurrentImageIndex] = useState(0);\n  const [showContactForm, setShowContactForm] = useState(false);",
    "  const [currentImageIndex, setCurrentImageIndex] = useState(0);"
)

# Replace the contact card section with InquiryForm
old_section = '''          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Agent</h2>
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-semibold"
              >
                Request Information
              </button>
              
              {showContactForm && (
                <form className="mt-4 space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <textarea
                    placeholder="Message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    defaultValue={`I'm interested in ${property.title}`}
                  />
                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>'''

new_section = '''          {/* Sidebar */}
          <div className="space-y-6">
            {/* Inquiry Form */}
            <InquiryForm propertyId={property._id} propertyTitle={property.title} />'''

content = content.replace(old_section, new_section)

# Write the file
with open(sys.argv[1], 'w', encoding='utf-8') as f:
    f.write(content)

print("File updated successfully!")
