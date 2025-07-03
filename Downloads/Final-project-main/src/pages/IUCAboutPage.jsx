import React from 'react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Award, 
  Globe, 
  Target, 
  Heart, 
  Lightbulb,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Shield,
  Star
} from 'lucide-react';
import Navbar from '../components/navbar/Navbar';

const IUCAboutPage = () => {
  const stats = [
    { icon: Users, number: "15,000+", label: "Students" },
    { icon: GraduationCap, number: "500+", label: "Faculty Members" },
    { icon: BookOpen, number: "50+", label: "Programs" },
    { icon: Award, number: "25+", label: "Years of Excellence" }
  ];

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Fostering creativity and cutting-edge research to solve tomorrow's challenges."
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "Upholding the highest standards of academic and ethical conduct."
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description: "Preparing students for success in an interconnected world."
    },
    {
      icon: Heart,
      title: "Community",
      description: "Building strong relationships and serving our local and global communities."
    }
  ];

  const leadership = [
    {
      name: "Dr. Sarah Thompson",
      position: "Chancellor",
      image: "https://images.unsplash.com/photo-1494790108755-2616c96db03b?w=300&h=300&fit=crop&crop=face",
      description: "Leading IUC with 20+ years of experience in higher education administration."
    },
    {
      name: "Prof. Michael Chen",
      position: "Vice Chancellor Academic Affairs",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description: "Overseeing academic excellence and curriculum development across all faculties."
    },
    {
      name: "Dr. Emily Rodriguez",
      position: "Dean of Student Affairs",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      description: "Dedicated to enhancing student experience and campus life initiatives."
    }
  ];

  const achievements = [
    "Top 100 Universities in Africa (2024)",
    "Excellence in Research Award (2023)",
    "Best Student Support Services (2023)",
    "Innovation in Online Learning (2022)",
    "Community Engagement Award (2022)"
  ];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-10">
          <div className="text-center">
            <h1 className="text-2xl md:text-2xl font-bold mb-6">
              About IUC University
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Shaping minds, building futures, and creating leaders for tomorrow's world
            </p>
            <div className="flex items-center justify-center space-x-2 text-lg">
              <MapPin className="w-5 h-5" />
              <span>Douala, Cameroon</span>
              <span className="mx-2">•</span>
              <Calendar className="w-5 h-5" />
              <span>Founded 1999</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-blue-50 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                To provide world-class education that empowers students with knowledge, skills, and values 
                necessary to become responsible global citizens and leaders in their chosen fields. We are 
                committed to fostering innovation, critical thinking, and lifelong learning in a diverse 
                and inclusive environment.
              </p>
            </div>
            
            <div className="bg-green-50 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                To be recognized as a leading institution of higher learning in Africa and beyond, 
                renowned for academic excellence, groundbreaking research, and producing graduates 
                who make meaningful contributions to society and drive positive change in the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at IUC University
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our History</h2>
              <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed text-lg">
                  Founded in 1999, the International University of Cameroon (IUC) began as a vision 
                  to provide quality higher education that meets international standards while remaining 
                  rooted in African values and traditions.
                </p>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Over the past 25 years, IUC has grown from a small institution with just 200 students 
                  to become one of Cameroon's premier universities, attracting students from across Africa 
                  and beyond. Our commitment to academic excellence and innovation has earned us recognition 
                  both nationally and internationally.
                </p>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Today, IUC stands as a beacon of educational excellence, continuing to evolve and adapt 
                  to meet the changing needs of our students and society while maintaining our core 
                  commitment to quality education and research.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=400&h=300&fit=crop" 
                alt="IUC Campus Building"
                className="rounded-lg shadow-md"
              />
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop" 
                alt="Students in Library"
                className="rounded-lg shadow-md mt-8"
              />
              <img 
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop" 
                alt="Graduation Ceremony"
                className="rounded-lg shadow-md -mt-8"
              />
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop" 
                alt="Campus Life"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      

      {/* Achievements */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Recent Achievements</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                IUC University continues to reach new heights of excellence, earning recognition 
                for our commitment to quality education, research, and community service.
              </p>
              
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-10 h-10 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Ranked #1 Private University in Cameroon
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Recognized for our outstanding academic programs, world-class faculty, 
                  and exceptional student outcomes by the National Education Assessment Board.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-300">
              Ready to join the IUC family? We'd love to hear from you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-300">
                IUC University Campus<br />
                Douala, Littoral Region<br />
                Cameroon
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">
                +237 123 456 789<br />
                +237 987 654 321
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">
                info@iuc.edu.cm<br />
                admissions@iuc.edu.cm
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default IUCAboutPage;