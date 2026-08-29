type HoneypotFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function HoneypotField({
  label,
  value,
  onChange,
}: HoneypotFieldProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute -left-[10000px] h-0 w-0 overflow-hidden"
    >
      <label htmlFor="company_website">{label}</label>
      <input
        id="company_website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
