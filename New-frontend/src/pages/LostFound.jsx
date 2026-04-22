import { motion } from "framer-motion";
import { Search, Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import PetCard from "../Components/Pets/PetCard";
import useDistanceMatrix from "../hooks/useDistanceMatrix";
import { API_BASE_URL } from "../config/api";
import "./LostFound.css";


const LostFoundPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const distances = useDistanceMatrix(reports);

  useEffect(() => {
    const fetchActiveReports = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/pets/reports/active/`
        );
        setReports(res.data || []);
      } catch (err) {
        console.error("Failed to load active reports", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const searchText = `${report.pet_name || ""} ${
        report.pet_type || ""
      } ${report.location_found || ""}`
        .toLowerCase()
        .trim();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      const matchesTab =
        activeTab === "all" ||
        report.report_type === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [reports, search, activeTab]);

  return (
    <div className="lf-container">
      <div className="lf-header">
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="badge1">
            <Sparkles size={16} /> Bring Them Home.
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lf-title">
            Lost &amp; Found Pets
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lf-subtitle">
            Help us reunite pets with their loving families.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}>
          <button
            className="lf-primary-btn"
            onClick={() => navigate("/reportPet")}>
            <Plus size={18} /> Report Lost / Found Pet
          </button>
        </motion.div>
      </div>

      <div className="lf-search-row">
        <div className="lf-search-box">
          <Search size={18} />
          <input
            placeholder="Search by pet name, type, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}/>
        </div>

        <div className="tabs">
          {["all", "lost", "found"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${
                activeTab === tab ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab)}>
              {tab === "all"
                ? "All"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="lf-grid">
        {!loading &&
          filteredReports.map((report) => (
            <PetCard
  key={report.id}
  pet={report}
  variant="lost-found"
  distanceInfo={distances[report.id]}
/>

          ))}
      </div>

      {!loading && filteredReports.length === 0 && (
        <div className="lf-empty">
          <Search size={48} />
          <h3>No reports found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}

      <div className="subscribe-box">
        <h2>Can't find what you're looking for?</h2>
        <p>New reports are added daily. Subscribe for alerts.</p>

        <div className="subscribe-form">
          <input placeholder="Email address" />
          <button>Subscribe to Alerts</button>
        </div>
      </div>
    </div>
  );
};

export default LostFoundPage;
