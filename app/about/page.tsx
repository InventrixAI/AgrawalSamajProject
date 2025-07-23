import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Eye, Award } from "lucide-react"
import historicalPhoto from "../public/maharaja.png"; // adjust path as per your folder structure


export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Learn about the history, mission, and values of Bilaspur Agrawal Sabha
          </p>
        </div>

        {/* History Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our History</h2>
              <p className="text-gray-600 mb-4">
                Bilaspur Agrawal Sabha was established with the vision of bringing together the Agrawal community in
                Bilaspur and surrounding areas. Since our inception, we have been dedicated to preserving our rich
                cultural heritage while adapting to modern times.
              </p>
              <p className="text-gray-600 mb-4">
                Our organization has grown from a small group of families to a thriving community that supports its
                members through various social, cultural, and educational initiatives.
              </p>
              <p className="text-gray-600">
                Today, we continue to serve as a bridge between generations, ensuring that our traditions are passed
                down while embracing progress and development.
              </p>
            </div>
            <div className="bg-white-200 rounded-lg h-96 flex items-center justify-center overflow-hidden">
            <img
              src="/maharaja.png"
              alt="Historical Photo"
              className="rounded-lg max-h-full max-w-full object-contain"
            />
          </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-left">
                  To unite the Agrawal community in Bilaspur, preserve our cultural heritage, and provide support and
                  opportunities for the growth and development of our members.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Eye className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-left">
                  To be the leading community organization that empowers Agrawal families while maintaining strong
                  cultural roots and fostering unity across generations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-left">
                  Unity, respect for tradition, community service, mutual support, and commitment to the welfare and
                  progress of all our members.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What We Do */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Cultural Events</h3>
                <p className="text-gray-600">
                  We organize festivals, cultural programs, and traditional celebrations to keep our heritage alive and
                  bring the community together.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Support</h3>
                <p className="text-gray-600">
                  We provide assistance to community members during times of need, including medical emergencies,
                  educational support, and social welfare.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Youth Development</h3>
                <p className="text-gray-600">
                  Special programs and initiatives focused on the development and engagement of young community members.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Business Network</h3>
                <p className="text-gray-600">
                  Facilitating business connections and opportunities among community members to promote economic growth
                  and collaboration.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Educational Initiatives</h3>
                <p className="text-gray-600">
                  Scholarships, educational workshops, and academic support programs for students in our community.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Social Welfare</h3>
                <p className="text-gray-600">
                  Various social service activities and charitable initiatives for the betterment of society and our
                  community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="bg-orange-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-gray-600">Active Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-gray-600">Events Organized</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">25+</div>
              <div className="text-gray-600">Years of Service</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">100+</div>
              <div className="text-gray-600">Families Supported</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
