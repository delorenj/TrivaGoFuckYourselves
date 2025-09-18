import { useState } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { Card } from '@/components/ui/card';

const HeroVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoId = 'RU97bK1-H58';

  // YouTube embed URL with autoplay and mute parameters
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&enablejsapi=1`;

  return (
    <section className="relative w-full mb-12">
      {/* Hero Video Container */}
      <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
        {/* Aspect Ratio Container for 16:9 */}
        <div className="relative pb-[56.25%] h-0">
          {!isPlaying ? (
            // Thumbnail with Play Button Overlay
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50">
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="Trivago Scam Exposed - Presentation"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="group relative flex items-center justify-center"
                  aria-label="Play video"
                >
                  <div className="absolute inset-0 bg-red-600 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-50"></div>
                  <div className="relative bg-red-600 hover:bg-red-700 text-white rounded-full p-6 transition-all transform hover:scale-110">
                    <Play className="w-12 h-12 ml-1" fill="white" />
                  </div>
                </button>
              </div>
              {/* Video Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
                  How Trivago Scammed Me Out of $366
                </h2>
                <p className="text-gray-200 text-sm md:text-base">
                  Watch the full breakdown of their deceptive practices
                </p>
              </div>
            </div>
          ) : (
            // YouTube Iframe
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={embedUrl}
              title="Trivago Scam Exposed"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>

        {/* Video Controls (when playing) */}
        {isPlaying && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>

      {/* Video Description Card */}
      <Card className="mt-6 p-6 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-brand-dark mb-2">
              Video Presentation: The $366 Midnight Scam
            </h3>
            <p className="text-gray-700">
              In this presentation, I break down exactly how Trivago's booking system
              charged me at 12:57 AM for a same-day hotel check-in - a physical impossibility
              that reveals their systematic fraud.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Evidence:</span>
              <span className="text-red-600">Transaction Screenshots</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Victim:</span>
              <span>Jarad DeLorenzo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Amount:</span>
              <span className="text-red-600 font-bold">$366.18</span>
            </div>
          </div>
        </div>

        {/* Key Points from Video */}
        <div className="mt-6 pt-6 border-t border-red-200">
          <h4 className="font-semibold text-brand-dark mb-3">Key Points Covered in This Video:</h4>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <span className="text-red-600 mt-1">▶</span>
              <span className="text-sm">Transaction occurred at 00:57:45 UTC (midnight)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-600 mt-1">▶</span>
              <span className="text-sm">Check-in date was THE SAME DAY as booking</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-600 mt-1">▶</span>
              <span className="text-sm">Hotel: Le Voyageur, Wildwood, NJ</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-600 mt-1">▶</span>
              <span className="text-sm">Trivago claimed "non-refundable" despite impossibility</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-600 mt-1">▶</span>
              <span className="text-sm">Credit card dispute was wrongfully denied</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-600 mt-1">▶</span>
              <span className="text-sm">Pattern matches their $44.7M fraud fine by ACCC</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-red-300">
          <p className="text-center text-sm text-gray-700">
            <span className="font-semibold">After watching this video:</span> Scroll down to generate your own complaint letter
            and join the fight against Trivago's deceptive practices.
          </p>
        </div>
      </Card>
    </section>
  );
};

export default HeroVideo;