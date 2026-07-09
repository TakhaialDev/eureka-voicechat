
const Overlay = ({onClick,zIndex}) => {
  return (
    <div onClick={onClick} className="fixed inset-0 bg-black/40 backdrop-blur-sm" style={{zIndex}}></div>
  )
}

export default Overlay