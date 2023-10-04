const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() - 1 == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

exports.isToday = isToday;
