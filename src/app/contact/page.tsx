'use client';

import { Car, Mail, Phone, MapPin, MessageSquare, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
            <Car className="h-6 w-6" />
            <span className="font-bold text-lg">Rides</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions? We&apos;re here to help. Reach out to us through any of these channels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span>Send us a Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help you?" />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                  />
                </div>

                <Button className="w-full">Send Message</Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">support@rides.ng</p>
                    <p className="text-sm text-gray-500">We&apos;ll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-600">+234 (0) 800-RIDES-NG</p>
                    <p className="text-sm text-gray-500">Mon-Fri 8AM-6PM WAT</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Office</h3>
                    <p className="text-gray-600">
                      123 Business District<br />
                      Victoria Island, Lagos<br />
                      Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold mb-2">For Renters</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li><Link href="/help/booking" className="hover:text-primary transition-colors">How to book a car</Link></li>
                    <li><Link href="/help/payment" className="hover:text-primary transition-colors">Payment & billing</Link></li>
                    <li><Link href="/help/insurance" className="hover:text-primary transition-colors">Insurance coverage</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">For Car Owners</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li><Link href="/help/listing" className="hover:text-primary transition-colors">List your car</Link></li>
                    <li><Link href="/help/earnings" className="hover:text-primary transition-colors">Earnings & payouts</Link></li>
                    <li><Link href="/help/protection" className="hover:text-primary transition-colors">Car protection</Link></li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Emergency Support</h2>
          <p className="text-gray-600 mb-4">
            Need immediate assistance during your rental? Our 24/7 emergency line is always available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="outline" size="lg">
              <Phone className="h-4 w-4 mr-2" />
              Emergency: +234 (0) 911-HELP
            </Button>
            <Button size="lg">
              <MessageSquare className="h-4 w-4 mr-2" />
              Live Chat Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}