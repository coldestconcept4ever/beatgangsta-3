const val = "+1.5dB";
console.log(val.replace(/([+-]?[\d.]+)\s*db/i, (match, p1) => {
  const v = parseFloat(p1);
  return (v * 100) + "%"; 
}));
