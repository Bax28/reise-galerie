import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";
import { useAuth } from "./context/AuthContext";
import { useSettings } from "./context/SettingsContext";
import config from "./config";

import Menu from "./components/Menu";
import Gallery from "./components/Gallery";
import Lightbox from "./components/Lightbox";
import ZoomSlider from "./components/ZoomSlider";
import LoginForm from "./components/LoginForm";
import AdminPanel from "./components/admin/AdminPanel";

function useDevice() {
  const [device, setDevice] = useState("desktop");

  useEffect(() => {
    function update() {
      const width = window.innerWidth;
      if (width < config.layout.breakpoints.tablet) setDevice("mobile");
      else if (width < config.layout.breakpoints.desktop) setDevice("tablet");
      else setDevice("desktop");
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return device;
}

export default function App() {
  const { isAdmin } = useAuth();
  const { activeFont } = useSettings();
  const device = useDevice();

  const [filters, setFilters] = useState({ year: null, place: null, trip: null });
  const [search, setSearch] = useState("");
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [lightboxPhotos, setLightboxPhotos] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [filterOptions, setFilterOptions] = useState({ years: [], places: [], trips: [] });

  useEffect(() => {
    async function loadFilterOptions() {
      const { data } = await supabase.from("trips").select("title, location, start_date");
      const years = new Set();
      const places = new Set();
      const trips = new Set();
      (data ?? []).forEach((trip) => {
        if (trip.start_date) years.add(new Date(trip.start_date).getFullYear().toString());
        if (trip.location) places.add(trip.location);
        if (trip.title) trips.add(trip.title);
      });
      setFilterOptions({
        years: [...years].sort((a, b) => b - a),
        places: [...places].sort(),
        trips: [...trips].sort(),
      });
    }
    loadFilterOptions();
  }, [refreshKey]);

  function openPhoto(photo, photosInTrip) {
    setLightboxPhoto(photo);
    setLightboxPhotos(photosInTrip);
  }

  return (
    <div style={{ fontFamily: activeFont.value }}>
      <Menu
        years={filterOptions.years}
        places={filterOptions.places}
        trips={filterOptions.trips}
        filters={filters}
        onChangeFilters={setFilters}
        search={search}
        onSearchChange={setSearch}
        onOpenLogin={() => setShowLogin(true)}
        onOpenAdmin={() => setShowAdmin(true)}
      />

      <main style={{ paddingTop: 88 }}>
        <Gallery
          filters={filters}
          search={search}
          onOpenPhoto={openPhoto}
          refreshKey={refreshKey}
        />
      </main>

      <ZoomSlider device={device} />

      {lightboxPhoto && (
        <Lightbox
          photo={lightboxPhoto}
          photos={lightboxPhotos}
          onClose={() => setLightboxPhoto(null)}
          onNavigate={setLightboxPhoto}
        />
      )}

      {showLogin && (
        <LoginForm
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setShowLogin(false);
            setShowAdmin(true);
          }}
        />
      )}

      {showAdmin && isAdmin && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          onDataChanged={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
}
