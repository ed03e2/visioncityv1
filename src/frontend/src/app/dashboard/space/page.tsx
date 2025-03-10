'use client';

import Link from 'next/link';

export default function ExplorePage() {
    const applications = [
      {
        title: "Capacity Counting",
        description: "Accurately count the number of people in various urban settings to ensure safety and comfort.",
        image: 'https://assets.api.uizard.io/api/cdn/stream/cf6813d4-3a02-4022-8739-54d0a1debf2a.png',
        href: '/dashboard/map'
      },
      {
        title: "Trajectories Analysis",
        description: "Analyze pedestrian paths to optimize urban space design and flow.",
        image: 'https://assets.api.uizard.io/api/cdn/stream/6a54dabc-e6e8-47c5-b345-c42c59ccca0d.png',
        href: '/dashboard/mapconf'
      },
      {
        title: "Duration of Stay",
        description: "Track how long visitors remain in specific areas to understand engagement areas.",
        image: 'https://assets.api.uizard.io/api/cdn/stream/6a3e24ac-3d73-4965-b7a5-626526caf2f1.png',
        href: '/dashboard/capacity-counting'

    },
      {
        title: "Activities Exploration",
        description: "Identify and categorize different activities taking place within urban parks.",
        image: 'https://assets.api.uizard.io/api/cdn/stream/6cc00559-aecc-4c0f-8d8f-f507d926541b.png',
        href: '/dashboard/capacity-counting'

    },
      {
        title: "Duration of Attention",
        description: "Measure how much attention specific installations or features receive.",
        image: 'https://assets.api.uizard.io/api/cdn/stream/b4bfb265-6156-46bc-a866-55d80ed91c5b.png',
        href: '/dashboard/capacity-counting'

    },
      {
        title: "Furniture Utilization",
        description: "Monitor the use of park furniture to optimize placement and design.",
        image: 'https://assets.api.uizard.io/api/cdn/stream/576137a1-54ab-493b-a303-d4d3393cefcd.png',
        href: '/dashboard/capacity-counting'

    },
      {
        title: "Pedestrian Interaction",
        description: "Understand how pedestrians interact in shared spaces to improve safety and accessibility.",
        image: 'https://assets.api.uizard.io/api/cdn/stream/35390d54-02f6-4033-acac-33e648c7fffd.png',
        href: '/dashboard/capacity-counting'

    }
    ];
  
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Explore Computer Vision Applications
          </h1>
          <p className="text-gray-600 mb-8">
            Discover how we analyze and interpret urban spaces using advanced computer vision technology.
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors">
            Get Started
          </button>
        </div>
  
        {/* Grid of Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {applications.map((app, index) => (
            <Link 
              href={app.href} 
              key={index} 
              className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={app.image}
                  alt={app.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{app.title}</h3>
                <p className="text-gray-600 text-sm">{app.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

