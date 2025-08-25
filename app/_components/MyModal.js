function MyModal({ children, ...props }) {
  const { onClick } = props;
  return (
    <section className="fixed inset-0 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-gray-400 opacity-60"
        onClick={onClick}
      ></div>
      <div className="bg-white absolute h-auto min-w-60 px-3 py-3 shadow-gray-300 shadow">
        {children}
      </div>
    </section>
  );
}

export default MyModal;
