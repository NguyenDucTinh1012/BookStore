import Icon from '../../../components/ui/Icon.jsx'

const presets = [
  { key: '7days', label: '7 ngày' },
  { key: '30days', label: '30 ngày' },
  { key: 'year', label: 'Từ đầu năm' },
]

export default function ReportFilters({ preset, startDate, endDate, onPresetChange, onDateChange, onExport, disabled }) {
  return (
    <section className="report-filter-panel" aria-label="Bộ lọc báo cáo">
      <div className="report-preset-list">{presets.map((item) => <button key={item.key} className={`report-preset ${preset === item.key ? 'selected' : ''}`} onClick={() => onPresetChange(item.key)}>{item.label}</button>)}</div>
      <div className="report-custom-range"><label><span>Từ ngày</span><input type="date" value={startDate} max={endDate || undefined} onChange={(event) => onDateChange('startDate', event.target.value)}/></label><span className="range-separator">đến</span><label><span>Đến ngày</span><input type="date" value={endDate} min={startDate || undefined} onChange={(event) => onDateChange('endDate', event.target.value)}/></label></div>
      <button className="export-button report-export" onClick={onExport} disabled={disabled}><Icon name="download" size={16}/> Xuất báo cáo</button>
    </section>
  )
}
