import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const videos = [
  {
    id: 'v1',
    title: 'Desert Bloom Villa — Full Tour',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
  },
  {
    id: 'v2',
    title: 'Terra Café — Behind the Design',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  },
  {
    id: 'v3',
    title: 'Our Design Process',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
  },
];

function VideoCard({ video, index }) {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-3xl bg-[#2A1E14] cursor-pointer"
      style={{ aspectRatio: '16/9' }}
    >
      {playing ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A110A]/80 via-[#1A110A]/20 to-transparent" />

          <div
            onClick={() => setPlaying(true)}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-[#A05035] flex items-center justify-center shadow-2xl shadow-[#A05035]/40"
            >
              <Play size={24} fill="white" className="text-white ml-1" />
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="font-cormorant text-xl font-semibold text-[#F5EFE6]">{video.title}</p>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function VideosSection() {
  return (
    <section className="py-32 px-6 bg-[#F5EFE6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-inter text-xs tracking-[0.3em] uppercase text-[#A05035] mb-4"
          >
            Watch &amp; Explore
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-cormorant text-6xl font-light text-[#3D2B1E]"
          >
            Our Videos
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-[#A05035] to-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}