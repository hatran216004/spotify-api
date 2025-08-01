exports.catchAsync = (callback) => {
  return (req, res, next) => {
    callback(req, res, next).catch(next);
  };
};

exports.fromLRC = (lrcContent) => {
  const lines = lrcContent.split('\n');
  const lyrics = [];

  lines.forEach((line) => {
    const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/); // Tìm thời gian và lời
    if (match) {
      const time = parseInt(match[1], 10) * 60000 + parseFloat(match[2]) * 1000;
      const text = match[3];
      lyrics.push({
        time,
        line: text
      });
    }
  });

  return lyrics;
};

exports.filterBody = (...body) => {
  console.log(body);
  return (req, res, next) => {
    //
    next();
  };
};
