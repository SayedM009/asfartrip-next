function MyModal({ children, ...props }) {
  const { onClick } = props;
  return (
    <section className="fixed inset-0 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-gray-900 opacity-60"
        onClick={onClick}
      ></div>
      <div
        className="bg-white absolute h-full w-full md:h-auto md:max-w-96 px-3 py-3 rounded animate-open
"
      >
        {children}
      </div>
    </section>
  );
}

export default MyModal;
