export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span>© {new Date().getFullYear()} Mohd Rihan</span>
        <a
          href="#top"
          className="footer-top"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
