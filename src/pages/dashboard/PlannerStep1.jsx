import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { ArrowRight } from 'lucide-react';

const PlannerStep1 = ({ onNext, defaultValues }) => {
  const [data, setData] = useState({
    destination: defaultValues.destination || '',
    startLocation: defaultValues.startLocation || '',
    startDate: defaultValues.startDate || '',
    endDate: defaultValues.endDate || '',
    days: defaultValues.days || '5',
    group: defaultValues.group || 'Solo',
    budget: defaultValues.budget || 'Mid-range',
    accommodation: defaultValues.accommodation || 'Hotel',
    transportation: defaultValues.transportation || 'Mixed'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelect = (category, value) => {
    setData(prev => ({ ...prev, [category]: value }));
  };

  const renderSelectable = (category, options) => (
    <div className="selectable-grid" style={{ marginBottom: '1.5rem' }}>
      {options.map(opt => (
        <div 
          key={opt}
          className={`selectable-card ${data[category] === opt ? 'selected' : ''}`}
          onClick={() => handleSelect(category, opt)}
          style={{ textAlign: 'center', padding: '0.75rem' }}
        >
          {opt}
        </div>
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="form-group">
          <label className="form-label">Destination</label>
          <input type="text" name="destination" value={data.destination} onChange={handleChange} className="form-input" placeholder="Where do you want to go?" />
        </div>
        <div className="form-group">
          <label className="form-label">Starting location</label>
          <input type="text" name="startLocation" value={data.startLocation} onChange={handleChange} className="form-input" placeholder="Where are you starting from?" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input type="date" name="startDate" value={data.startDate} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input type="date" name="endDate" value={data.endDate} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Number of days</label>
          <input type="number" name="days" value={data.days} onChange={handleChange} className="form-input" min="1" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Travel Group</label>
        {renderSelectable('group', ['Solo', 'Couple', 'Friends', 'Family'])}
      </div>

      <div className="form-group">
        <label className="form-label">Budget</label>
        {renderSelectable('budget', ['Budget', 'Mid-range', 'Premium'])}
      </div>
      
      <div className="form-group">
        <label className="form-label">Accommodation</label>
        {renderSelectable('accommodation', ['Hotel', 'Hostel', 'Homestay', 'Guesthouse', 'Camping', 'Flexible'])}
      </div>

      <div className="form-group">
        <label className="form-label">Transportation</label>
        {renderSelectable('transportation', ['Public transport', 'Private vehicle', 'Walking/Trekking', 'Mixed'])}
      </div>

      <div className="planner-actions" style={{ justifyContent: 'flex-end' }}>
        <Button variant="primary" onClick={() => onNext(data)}>
          Continue <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default PlannerStep1;
