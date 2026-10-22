
const commons = (file) => `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=240`;

export const SPECIES = [
  { value: "T-Rex", code: "TR", image: commons("202007_Tyrannosaurus_rex.svg") },
  { value: "Triceratops", code: "TC", image: commons("202007_Triceratops_horridus.svg") },
  { value: "Velociraptor", code: "VR", image: commons("Velociraptor_Restoration.png") },
  { value: "Stegosaurus", code: "SG", image: commons("202009_Stegosaurus_stenops.png") },
  { value: "Brachiosaurus", code: "BR", image: commons("202009_Brachiosaurus_altithorax.svg") },
  { value: "Ankylosaurus", code: "AN", image: commons("202007_Ankylosaurus_magniventris.svg") },
  { value: "Spinosaurus", code: "SP", image: commons("202005_Spinosaurus_aegyptiacus.svg") },
];

export const DIETS = ["Carnivore", "Herbivore", "Omnivore"];
export const PERIODS = ["Triassic", "Jurassic", "Cretaceous"];
export const ENCLOSURES = ["Jungle", "Volcano valley", "River delta", "Fern meadow", "Rocky cliffs"];

export const SORT_OPTIONS = [
  { value: "name", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
];

export const PAGE_SIZE = 6;

export function getSpecies(value) {
  return SPECIES.find((s) => s.value === value);
}

export function formatWeight(kg) {
  if (kg === undefined || kg === null || kg === "") return "—";
  return kg >= 1000 ? `${(kg / 1000).toFixed(1)} t` : `${kg} kg`;
}

export function formatLength(m) {
  if (m === undefined || m === null || m === "") return "—";
  return `${m} m`;
}
