
export const Badge = ({ title, value, total, textColor, bgColor }: any) => {
  return (
    <div className={`flex flex-col w-full py-1 text-center text-base rounded-lg`}
      style={{ color: textColor, background: bgColor }}>
      <div className="flex flex-col mx-auto">
        <p className={`border-b`} style={{ borderColor: textColor }}>{value}</p>
        <p>{total}</p>
      </div>
      <p>{title}</p>
    </div>
  )
}