import React from "react";
import { MapPin, Calendar, Clock, Users } from "lucide-react";

export default function CompletedEvents({ events = [] }) {
  return (
    <section className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          Completed Events
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {events.map((event, index) => {
            // Parse dynamic speakers array stored as JSON string in the backend database
            let speakersArray = [];
            if (event.speakerContact) {
              try {
                speakersArray = JSON.parse(event.speakerContact);
              } catch (e) {
                speakersArray = [event.speakerContact];
              }
            }

            return (
              <div
                key={event.id || event._id || index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
              >
                <div>
                  {/* Event Poster Area */}
                  <div className="relative overflow-hidden aspect-[4/5] bg-gray-100">
                    <img
                      src={`${event.poster}`}
                      alt={event.eventTitle || "Completed Event"}
                      className="w-full h-full object-cover hover:scale-101 transition duration-300"
                      onError={(e) => { e.target.src = "https://placehold.co/300x450/EEE/31343C?text=No+Poster" }}
                    />

                  
                  </div>

                  {/* Details Area */}
                  <div className="p-5 space-y-3 flex-grow">
                    {/* Institution Label */}
                    {event.collegeName && (
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wide block">
                        {event.collegeName}
                      </span>
                    )}

                    

                    {/* Physical Location Field Display */}
                    {event.location && (
                      <div className="flex items-start gap-2 text-gray-600 text-sm">
                        <MapPin
                          size={16}
                          className="text-emerald-600 mt-0.5 flex-shrink-0"
                        />
                        <span className="line-clamp-2">{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Speakers Section — cleanly handles multi-speaker arrays if present */}
                {speakersArray.length > 0 && (
                  <div className="p-5 pt-0 border-t border-gray-100 mt-auto">
                    <div className="flex items-start gap-2 pt-3 text-gray-600 text-sm">
                      <Users size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="w-full">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                          Speakers / Contacts
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {speakersArray.map((speaker, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded font-medium border border-gray-200">
                              {speaker}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}