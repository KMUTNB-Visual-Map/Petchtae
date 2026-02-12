const avatars = ["boy.glb", "girl.glb", "robot.glb"];
const [selected, setSelected] = useState("boy.glb");

return (
  <>
    {avatars.map(a => (
      <button key={a} onClick={() => setSelected(a)}>
        {a}
      </button>
    ))}
    <Avatar modelUrl={`/models/${selected}`} />
  </>
);
