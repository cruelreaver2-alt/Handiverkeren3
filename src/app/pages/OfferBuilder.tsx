import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Header } from "../components/Header";
import {
  Search,
  Plus,
  Trash2,
  Calculator,
  FileText,
  Brain,
  Sparkles,
  Package,
  DollarSign,
  Clock,
  Shield,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { MATERIAL_DATABASE, Material, SelectedMaterial } from "../data/materials";

// Material database is now imported from /src/app/data/materials.tsx

interface Calculator {
  type: string;
  area?: number;
  length?: number;
  items: CalculatorItem[];
}

interface CalculatorItem {
  name: string;
  quantity: number;
  unit: string;
}

interface JobDetails {
  id: string;
  customerId: string;
  category: string;
  title: string;
  description: string;
  location: string;
  budgetMin?: number;
  budgetMax?: number;
}

export function OfferBuilder() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const isPro = searchParams.get("plan") === "pro"; // Check if user is Pro subscriber

  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"materials" | "calculator">("materials");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterial[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  // Custom material modal
  const [showCustomMaterialModal, setShowCustomMaterialModal] = useState(false);
  const [customMaterialName, setCustomMaterialName] = useState("");
  const [customMaterialCategory, setCustomMaterialCategory] = useState("");
  const [customMaterialUnit, setCustomMaterialUnit] = useState("stk");
  const [customMaterialPrice, setCustomMaterialPrice] = useState("");

  // Price edit modal
  const [showPriceEditModal, setShowPriceEditModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editedPrice, setEditedPrice] = useState("");
  const [editedQuantity, setEditedQuantity] = useState("");

  // Calculator state
  const [calculatorType, setCalculatorType] = useState<"roof" | "painting" | "flooring" | "deck" | "cladding">("roof");
  const [calcArea, setCalcArea] = useState("");
  const [calcLength, setCalcLength] = useState("");
  const [calcWidth, setCalcWidth] = useState("");
  const [calcResults, setCalcResults] = useState<CalculatorItem[]>([]);
  
  // Advanced roof calculator state
  const [roofType, setRoofType] = useState<"saltak" | "valm">("saltak");
  const [roofAngle, setRoofAngle] = useState("");
  const [roofHeight, setRoofHeight] = useState("");
  const [roofBase, setRoofBase] = useState("");
  const [tileType, setTileType] = useState("monier"); // Type takstein
  const [includeEndTiles, setIncludeEndTiles] = useState(true); // Om man vil ha endesten
  const [useAngleCalc, setUseAngleCalc] = useState(false);
  const [stormClipsIntensity, setStormClipsIntensity] = useState<"standard" | "medium" | "high">("standard"); // Stormklips-intensitet

  // Advanced flooring calculator state
  const [floorType, setFloorType] = useState<"laminat" | "parkett" | "vinyl">("laminat");
  const [layingPattern, setLayingPattern] = useState<"rett" | "diagonal" | "fiskeben">("rett");
  const [includeBaseboards, setIncludeBaseboards] = useState(true);
  const [includeTransition, setIncludeTransition] = useState(true);
  const [includeMoisture, setIncludeMoisture] = useState(false);
  const [numberOfDoors, setNumberOfDoors] = useState("1");

  // Advanced deck calculator state
  const [deckBoardType, setDeckBoardType] = useState<"trykkimpregnert-rillet" | "trykkimpregnert-glatt" | "royal" | "kebony" | "kompositt">("trykkimpregnert-rillet");
  const [deckBoardSize, setDeckBoardSize] = useState<"28x120" | "28x145" | "34x145" | "48x145" | "25x140">("28x145");
  const [beamSize, setBeamSize] = useState<"48x98" | "48x148" | "48x198">("48x148");
  const [beamSpacing, setBeamSpacing] = useState<"cc40" | "cc60">("cc60");
  const [includeRailing, setIncludeRailing] = useState(false);
  const [railingLength, setRailingLength] = useState("");

  // Advanced cladding calculator state
  const [claddingType, setCladdingType] = useState<"standing" | "dobbelfals" | "enkelfals">("standing");
  const [wallType, setWallType] = useState<"gable" | "short" | "long">("gable");
  const [wallLength, setWallLength] = useState("");
  const [wallHeight, setWallHeight] = useState("");
  const [gableTopHeight, setGableTopHeight] = useState(""); // For gable walls only

  // Offer details
  const [offerDescription, setOfferDescription] = useState("");
  const [timeline, setTimeline] = useState("");
  const [warranty, setWarranty] = useState("2 år garanti");
  const [laborCost, setLaborCost] = useState("");
  const [paymentOption, setPaymentOption] = useState<"upfront" | "postpaid">("postpaid");
  const [depositPercentage, setDepositPercentage] = useState(50);

  // Demo mode for testing Pro features
  const [demoProMode, setDemoProMode] = useState(false);

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/requests/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to load job details. Status:", response.status, "Error:", errorData);
        throw new Error(errorData.error || "Failed to load job details");
      }

      const data = await response.json();
      
      if (!data.request) {
        console.error("No request data in response:", data);
        throw new Error("No request data returned");
      }
      
      setJob(data.request);
    } catch (error) {
      console.error("Error loading job:", error);
      setError(`Kunne ikke laste jobbdetaljer for ID: ${jobId}`);
      // Don't navigate away, let the error state show
    } finally {
      setLoading(false);
    }
  };

  // Get all materials from database
  const getAllMaterials = (): Material[] => {
    return Object.values(MATERIAL_DATABASE).flat();
  };

  // Filter materials based on search and category
  const getFilteredMaterials = (): Material[] => {
    let materials = selectedCategory === "all" 
      ? getAllMaterials() 
      : MATERIAL_DATABASE[selectedCategory as keyof typeof MATERIAL_DATABASE] || [];

    if (searchQuery) {
      materials = materials.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return materials;
  };

  const addMaterial = (material: Material) => {
    // Open price edit modal for adding material
    setEditingMaterial(material);
    setEditedPrice(material.pricePerUnit.toString());
    setEditedQuantity("1");
    setShowPriceEditModal(true);
  };

  const confirmAddMaterial = () => {
    if (!editingMaterial) return;

    const price = parseFloat(editedPrice) || editingMaterial.pricePerUnit;
    const quantity = parseFloat(editedQuantity) || 1;

    const existing = selectedMaterials.find((m) => m.id === editingMaterial.id);
    if (existing) {
      // Update existing material - replace values instead of adding
      setSelectedMaterials(
        selectedMaterials.map((m) =>
          m.id === editingMaterial.id
            ? { ...m, pricePerUnit: price, quantity: quantity, totalPrice: price * quantity }
            : m
        )
      );
    } else {
      // Add new material
      setSelectedMaterials([
        ...selectedMaterials,
        { ...editingMaterial, pricePerUnit: price, quantity, totalPrice: price * quantity },
      ]);
    }

    setShowPriceEditModal(false);
    setEditingMaterial(null);
    setEditedPrice("");
    setEditedQuantity("");
  };

  const updateMaterialQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeMaterial(id);
      return;
    }
    setSelectedMaterials(
      selectedMaterials.map((m) =>
        m.id === id
          ? { ...m, quantity, totalPrice: m.pricePerUnit * quantity }
          : m
      )
    );
  };

  const updateMaterialPrice = (id: string, newPrice: number) => {
    setSelectedMaterials(
      selectedMaterials.map((m) =>
        m.id === id
          ? { ...m, pricePerUnit: newPrice, totalPrice: newPrice * m.quantity }
          : m
      )
    );
  };

  const removeMaterial = (id: string) => {
    setSelectedMaterials(selectedMaterials.filter((m) => m.id !== id));
  };

  const openCustomMaterialModal = () => {
    setCustomMaterialName(searchQuery);
    setCustomMaterialCategory("Annet");
    setCustomMaterialUnit("stk");
    setCustomMaterialPrice("");
    setShowCustomMaterialModal(true);
  };

  const createCustomMaterial = () => {
    if (!customMaterialName.trim()) {
      alert("Vennligst oppgi produktnavn");
      return;
    }

    const price = parseFloat(customMaterialPrice);
    if (!price || price <= 0) {
      alert("Vennligst oppgi gyldig pris");
      return;
    }

    const customMaterial: Material = {
      id: `custom-${Date.now()}`,
      name: customMaterialName,
      category: customMaterialCategory || "Annet",
      unit: customMaterialUnit,
      pricePerUnit: price,
      coverage: 0,
    };

    setSelectedMaterials([
      ...selectedMaterials,
      { ...customMaterial, quantity: 1, totalPrice: price },
    ]);

    setShowCustomMaterialModal(false);
    setCustomMaterialName("");
    setCustomMaterialCategory("");
    setCustomMaterialUnit("stk");
    setCustomMaterialPrice("");
  };

  // Add calculator results to materials list
  const addCalculatorResultsToMaterials = () => {
    if (calcResults.length === 0) {
      alert("Ingen kalkulerte materialer å legge til");
      return;
    }

    // Filter out informational items (like area calculations, angles, waste percentages)
    const materialItems = calcResults.filter(item => 
      !item.name.includes("Grunnflate") && 
      !item.name.includes("Takflate") &&
      !item.name.includes("vinkel") &&
      !item.name.includes("faktor") &&
      !item.name.includes("Kapp/svinn") &&
      !item.name.includes("herav ramme") &&
      item.unit !== "%" &&
      item.unit !== "°" &&
      item.unit !== "grader" &&
      item.unit !== "x"
    );

    if (materialItems.length === 0) {
      alert("Ingen materialer å legge til fra kalkulatoren");
      return;
    }

    // Create custom materials from calculator results
    const newMaterials = materialItems.map(item => {
      // Try to find matching material in database
      // Flatten the MATERIAL_DATABASE object into an array
      const allMaterials = Object.values(MATERIAL_DATABASE).flat();
      const dbMaterial = allMaterials.find(m => 
        m.name.toLowerCase().includes(item.name.toLowerCase()) ||
        item.name.toLowerCase().includes(m.name.toLowerCase().split(" ")[0])
      );

      const material: Material = {
        id: `calc-${Date.now()}-${Math.random()}`,
        name: item.name,
        category: dbMaterial?.category || "Kalkulert materiale",
        unit: item.unit,
        pricePerUnit: dbMaterial?.pricePerUnit || 0,
        coverage: dbMaterial?.coverage || 0,
      };

      return {
        ...material,
        quantity: item.quantity,
        totalPrice: material.pricePerUnit * item.quantity,
      };
    });

    // Add to selected materials (merge if already exists)
    const updatedMaterials = [...selectedMaterials];
    
    newMaterials.forEach(newMat => {
      const existingIndex = updatedMaterials.findIndex(m => 
        m.name.toLowerCase() === newMat.name.toLowerCase()
      );
      
      if (existingIndex >= 0) {
        // Update quantity if material already exists
        updatedMaterials[existingIndex] = {
          ...updatedMaterials[existingIndex],
          quantity: newMat.quantity,
          totalPrice: updatedMaterials[existingIndex].pricePerUnit * newMat.quantity,
        };
      } else {
        // Add new material
        updatedMaterials.push(newMat);
      }
    });

    setSelectedMaterials(updatedMaterials);
    alert(`${materialItems.length} materiale(r) lagt til i listen!`);
  };

  // Calculator functions
  const calculateRoofMaterials = () => {
    // Get input values
    const length = parseFloat(calcLength);
    const width = parseFloat(calcWidth);
    const directArea = parseFloat(calcArea);
    
    // Determine if we're using L x B or direct area
    let baseArea = 0;
    if (length > 0 && width > 0) {
      baseArea = length * width;
    } else if (directArea > 0) {
      baseArea = directArea;
      // Set default length if not provided (for calculations)
      if (!length || length <= 0) {
        alert("Når du bruker direkte areal, må du også oppgi lengde for beregning av mønestein og takrenner");
        return;
      }
    } else {
      alert("Vennligst oppgi lengde x bredde ELLER direkte areal");
      return;
    }

    // Calculate roof angle if using height method
    let angle = parseFloat(roofAngle);
    if (useAngleCalc) {
      const height = parseFloat(roofHeight);
      const base = parseFloat(roofBase);
      if (height > 0 && base > 0) {
        // Calculate angle using arctan
        angle = Math.atan(height / (base / 2)) * (180 / Math.PI);
      } else {
        alert("Vennligst oppgi høyde og bredde for vinkelberegning");
        return;
      }
    } else if (!angle || angle <= 0) {
      alert("Vennligst oppgi takvinkel");
      return;
    }

    // Calculate slope factor (correction for roof angle)
    const slopeFactor = 1 / Math.cos(angle * Math.PI / 180);

    // Calculate roof area based on roof type
    let totalRoofArea = 0;
    if (roofType === "saltak") {
      // Saltak: two rectangular slopes
      // Each slope = (length × width/2) × slopeFactor
      totalRoofArea = baseArea * slopeFactor;
    } else if (roofType === "valm") {
      // Valmtak: four slopes (two trapezoids + two triangles)
      // Approximation: total base area × slopeFactor × 1.05 (accounting for hip complexity)
      totalRoofArea = baseArea * slopeFactor * 1.05;
    }

    const results: CalculatorItem[] = [];

    // Add area calculations to results for transparency
    results.push({ name: "Grunnflate (horisontalt)", quantity: Math.round(baseArea * 10) / 10, unit: "m²" });
    results.push({ name: "Takflate (skrått)", quantity: Math.round(totalRoofArea * 10) / 10, unit: "m²" });

    // Takstein calculation based on type - each type has unique properties
    let tilesPerSqm = 10;
    let tileCoverage = 0.33;
    let fullTileRatio = 0.85;
    let halfTileRatio = 0.10;
    let ridgeTileSpacing = 0.33; // Mønestein spacing
    let endTileSpacing = 0.33;
    let tileName = "Takstein";
    
    switch (tileType) {
      case "monier":
        // Monier Novo - standard coverage
        tilesPerSqm = 10;
        tileCoverage = 0.33;
        fullTileRatio = 0.87;
        halfTileRatio = 0.08;
        ridgeTileSpacing = 0.33; // ~3 mønestein per meter
        endTileSpacing = 0.33;
        tileName = "Monier Novo";
        break;
      case "optimal":
        // Optimal Protector - wider coverage
        tilesPerSqm = 9.8;
        tileCoverage = 0.34;
        fullTileRatio = 0.86;
        halfTileRatio = 0.09;
        ridgeTileSpacing = 0.35; // ~2.9 mønestein per meter
        endTileSpacing = 0.35;
        tileName = "Optimal Protector";
        break;
      case "braas":
        // Braas Turmalin - larger format
        tilesPerSqm = 9.5;
        tileCoverage = 0.35;
        fullTileRatio = 0.84;
        halfTileRatio = 0.11;
        ridgeTileSpacing = 0.36; // ~2.8 mønestein per meter
        endTileSpacing = 0.36;
        tileName = "Braas Turmalin";
        break;
      case "skarpnes-optimal":
        // Skarpnes Optimal - standard coverage
        tilesPerSqm = 10;
        tileCoverage = 0.33;
        fullTileRatio = 0.87;
        halfTileRatio = 0.08;
        ridgeTileSpacing = 0.33;
        endTileSpacing = 0.33;
        tileName = "Skarpnes Optimal";
        break;
      case "skarpnes-optimal-xl":
        // Skarpnes Optimal XL - larger format
        tilesPerSqm = 9;
        tileCoverage = 0.36;
        fullTileRatio = 0.85;
        halfTileRatio = 0.10;
        ridgeTileSpacing = 0.36;
        endTileSpacing = 0.36;
        tileName = "Skarpnes Optimal XL";
        break;
      case "skarpnes-topas":
        // Skarpnes Topas - compact format
        tilesPerSqm = 10.5;
        tileCoverage = 0.31;
        fullTileRatio = 0.88;
        halfTileRatio = 0.07;
        ridgeTileSpacing = 0.32;
        endTileSpacing = 0.32;
        tileName = "Skarpnes Topas";
        break;
      case "skarpnes-ambassador":
        // Skarpnes Ambassador - premium format
        tilesPerSqm = 9.8;
        tileCoverage = 0.34;
        fullTileRatio = 0.86;
        halfTileRatio = 0.09;
        ridgeTileSpacing = 0.34;
        endTileSpacing = 0.34;
        tileName = "Skarpnes Ambassador";
        break;
    }

    // Calculate tiles with waste factor (+5%)
    const wasteFactor = 1.05;
    const totalTilesNeeded = Math.ceil(totalRoofArea * tilesPerSqm * wasteFactor);
    const fullTiles = Math.ceil(totalTilesNeeded * fullTileRatio);
    const halfTiles = Math.ceil(totalTilesNeeded * halfTileRatio);

    results.push({ name: `${tileName} - Fullsten`, quantity: fullTiles, unit: "stk" });
    results.push({ name: `${tileName} - Halvsten`, quantity: halfTiles, unit: "stk" });
    
    // Endesten - only for saltak (gavler), not valmtak
    if (includeEndTiles && roofType === "saltak") {
      // Endesten brukes på gavlene (endene av huset)
      // Beregn lengden langs gavlen (bredde/2 * slopeFactor for skråningen, * 2 for begge gavler)
      const gableHeight = (width / 2) * slopeFactor;
      const endTilesPerGable = Math.ceil(gableHeight / endTileSpacing);
      const totalEndTiles = endTilesPerGable * 2; // to gavler
      results.push({ name: `${tileName} - Endesten (gavler)`, quantity: totalEndTiles, unit: "stk" });
    }

    // Mønestein calculation (for ridge and hips) - varies by tile type
    let ridgeLength = length; // Ridge length
    if (roofType === "valm") {
      // Valm roof has hips as well
      const hipLength = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(length / 2, 2)) * 2;
      ridgeLength += hipLength;
    }
    const ridgeTiles = Math.ceil(ridgeLength / ridgeTileSpacing);
    results.push({ name: `${tileName} - Mønestein`, quantity: ridgeTiles, unit: "stk" });

    // Stormklips - Advanced calculation based on Norwegian building codes
    // Randsoner (gavl, takfot, møne) + gjennomføringer + midtparti
    let stormClips = 0;
    
    // 1. Randsoner (1-2m inn fra kant): hver stein
    const edgeZoneDepth = 1.5; // meter inn fra kant (gjennomsnitt)
    let edgeArea = 0;
    
    if (roofType === "saltak") {
      // Gavl: to gavler × høyde × dybde
      const gableHeight = (width / 2) * slopeFactor;
      edgeArea += (gableHeight * edgeZoneDepth * 2); // Begge gavler
      // Takfot: to langsider × lengde × dybde
      edgeArea += (length * edgeZoneDepth * 2);
    } else if (roofType === "valm") {
      // Alle fire sider × omkrets × dybde
      const perimeter = (length + width) * 2;
      edgeArea = perimeter * edgeZoneDepth;
    }
    
    const edgeClips = Math.ceil(edgeArea * tilesPerSqm); // Hver stein i randsone
    
    // 2. Mønestein: alle stein langs møne
    const ridgeClips = ridgeTiles;
    
    // 3. Midtparti: basert på intensitet
    const midArea = totalRoofArea - edgeArea;
    let midAreaClips = 0;
    
    switch (stormClipsIntensity) {
      case "standard":
        // Annenhver til hver tredje stein (gjennomsnitt 35%)
        midAreaClips = Math.ceil(midArea * tilesPerSqm * 0.35);
        break;
      case "medium":
        // Annenhver stein (~50%)
        midAreaClips = Math.ceil(midArea * tilesPerSqm * 0.50);
        break;
      case "high":
        // Alle stein (utsatte områder/høyt tak)
        midAreaClips = Math.ceil(midArea * tilesPerSqm);
        break;
    }
    
    stormClips = edgeClips + ridgeClips + midAreaClips;
    
    results.push({ name: "Stormklips", quantity: stormClips, unit: "stk" });

    // Takrenner calculation with all components
    let gutterLength = 0;
    let gutterCorners = 0;
    
    if (roofType === "saltak") {
      // Saltak: gutters on both long sides
      gutterLength = length * 2;
      gutterCorners = 2; // 2 hjørner (ett i hver ende)
    } else if (roofType === "valm") {
      // Valm: gutters on all four sides
      gutterLength = (length + width) * 2;
      gutterCorners = 4; // 4 hjørner
    }
    
    results.push({ name: "Takrenner", quantity: Math.ceil(gutterLength), unit: "m" });
    results.push({ name: "Takrennehjørner", quantity: gutterCorners, unit: "stk" });
    
    // Nedløpsrør: 5m per hjørne
    const downpipeLength = gutterCorners * 5;
    results.push({ name: "Nedløpsrør", quantity: downpipeLength, unit: "m" });
    
    // Nedløpsstykker: 1 per hjørne
    results.push({ name: "Nedløpsstykker", quantity: gutterCorners, unit: "stk" });
    
    // Rennekroker: 1 per 60cm
    const gutterBrackets = Math.ceil(gutterLength / 0.6);
    results.push({ name: "Rennekroker", quantity: gutterBrackets, unit: "stk" });
    
    // Skjøtestykker: 1 per 3 meter takrenne (standard lengde takrenne er 3m)
    const gutterJoints = Math.ceil(gutterLength / 3);
    results.push({ name: "Skjøtestykker takrenne", quantity: gutterJoints, unit: "stk" });
    
    // Fotbeslag: Standard lengde 2m
    const fotBeslag = Math.ceil(gutterLength / 2);
    results.push({ name: "Fotbeslag 2m", quantity: fotBeslag, unit: "stk" });

    // Undertak (total roof area + 10% waste)
    results.push({ name: "Undertak", quantity: Math.ceil(totalRoofArea * 1.1), unit: "m²" });

    // Lekter calculation (horizontal battens)
    const lekterSpacing = 0.35; // 35cm spacing
    const numberOfLekter = Math.ceil((width * slopeFactor) / lekterSpacing);
    const lekterLength = numberOfLekter * length;
    results.push({ name: "Lekter 36x48mm", quantity: Math.ceil(lekterLength), unit: "m" });

    // Add calculated angle to results for display
    results.push({ name: "Beregnet vinkel", quantity: Math.round(angle * 10) / 10, unit: "grader" });
    results.push({ name: "Helningsfaktor", quantity: Math.round(slopeFactor * 100) / 100, unit: "x" });

    setCalcResults(results);
    setShowCalculator(false);

    // Auto-add materials
    autoAddCalculatedMaterials(results);
  };

  const calculatePaintingMaterials = () => {
    const area = parseFloat(calcArea);
    if (!area || area <= 0) {
      alert("Vennligst oppgi gyldig areal");
      return;
    }

    const results: CalculatorItem[] = [];

    // Paint (coverage: 10m² per liter)
    const paintLiters = Math.ceil(area / 10);
    results.push({ name: "Maling", quantity: paintLiters, unit: "liter" });

    // Primer (coverage: 8m² per liter)
    const primerLiters = Math.ceil(area / 8);
    results.push({ name: "Grunning", quantity: primerLiters, unit: "liter" });

    setCalcResults(results);
    setShowCalculator(false);
    autoAddCalculatedMaterials(results);
  };

  const calculateFlooringMaterials = () => {
    // Calculate area from L x B if provided, otherwise use direct area input
    let area = parseFloat(calcArea);
    const length = parseFloat(calcLength);
    const width = parseFloat(calcWidth);
    
    if (length > 0 && width > 0) {
      area = length * width;
    }
    
    if (!area || area <= 0) {
      alert("Vennligst oppgi gyldig areal (direkte eller via Lengde x Bredde)");
      return;
    }

    const results: CalculatorItem[] = [];

    // Calculate waste percentage based on laying pattern
    let wastePercentage = 0.05; // Default 5%
    let patternName = "";
    
    switch (layingPattern) {
      case "rett":
        wastePercentage = 0.07; // 7% waste for straight laying
        patternName = "rett legging";
        break;
      case "diagonal":
        wastePercentage = 0.12; // 12% waste for diagonal
        patternName = "diagonal legging";
        break;
      case "fiskeben":
        wastePercentage = 0.18; // 18% waste for herringbone
        patternName = "fiskeben";
        break;
    }

    // Flooring with waste
    const flooringWithWaste = Math.ceil(area * (1 + wastePercentage) * 10) / 10;
    
    // Floor type specific naming
    let floorTypeName = "";
    switch (floorType) {
      case "laminat":
        floorTypeName = "Laminatgulv";
        break;
      case "parkett":
        floorTypeName = "Parkettgulv";
        break;
      case "vinyl":
        floorTypeName = "Vinylgulv";
        break;
    }
    
    results.push({ 
      name: `${floorTypeName} (${patternName})`, 
      quantity: flooringWithWaste, 
      unit: "m²" 
    });

    // Underlayment (1:1 with flooring area + waste)
    const underlayment = Math.ceil(area * (1 + wastePercentage) * 10) / 10;
    results.push({ name: "Gulvunderlag", quantity: underlayment, unit: "m²" });

    // Moisture barrier (if selected)
    if (includeMoisture) {
      const moistureBarrier = Math.ceil(area * 1.05 * 10) / 10; // 5% overlap
      results.push({ name: "Dampsperre", quantity: moistureBarrier, unit: "m²" });
    }

    // Baseboards (perimeter calculation)
    if (includeBaseboards && length > 0 && width > 0) {
      const perimeter = (length + width) * 2;
      results.push({ name: "Gulvlist", quantity: Math.ceil(perimeter), unit: "m" });
      
      // Corner joints (4 inner corners typically)
      results.push({ name: "Hjørnelister", quantity: 4, unit: "stk" });
      
      // End caps for baseboards
      results.push({ name: "Endestykker", quantity: 4, unit: "stk" });
    }

    // Transition strips
    if (includeTransition) {
      const doors = parseInt(numberOfDoors) || 1;
      results.push({ name: "Overgangslist", quantity: doors, unit: "stk" });
    }

    // Adhesive/glue (for certain floor types)
    if (floorType === "vinyl" || floorType === "parkett") {
      const glueBottles = Math.ceil(area / 15); // ~15m² per bottle/bucket
      results.push({ name: "Gulvlim", quantity: glueBottles, unit: "stk" });
    }

    // Add info about waste percentage used
    results.push({ 
      name: "Kapp/svinn", 
      quantity: Math.round(wastePercentage * 100), 
      unit: "%" 
    });

    setCalcResults(results);
    setShowCalculator(false);
    autoAddCalculatedMaterials(results);
  };

  const calculateDeckMaterials = () => {
    // Calculate area from L x B (required)
    const length = parseFloat(calcLength);
    const width = parseFloat(calcWidth);
    
    if (!length || length <= 0 || !width || width <= 0) {
      alert("Vennligst oppgi lengde og bredde");
      return;
    }

    const area = length * width;
    const results: CalculatorItem[] = [];

    // Deck board specifications based on size selection
    let boardWidthMm = 145;
    let boardThicknessMm = 28;
    
    switch (deckBoardSize) {
      case "28x120":
        boardWidthMm = 120;
        boardThicknessMm = 28;
        break;
      case "28x145":
        boardWidthMm = 145;
        boardThicknessMm = 28;
        break;
      case "34x145":
        boardWidthMm = 145;
        boardThicknessMm = 34;
        break;
      case "48x145":
        boardWidthMm = 145;
        boardThicknessMm = 48;
        break;
      case "25x140":
        boardWidthMm = 140;
        boardThicknessMm = 25;
        break;
    }

    const boardWidth = boardWidthMm / 1000; // Convert to meters
    
    // Waste and name based on type
    let boardWaste = 0.20; // 20% waste standard
    let boardTypeName = "";
    
    switch (deckBoardType) {
      case "trykkimpregnert-rillet":
        boardTypeName = `Terrassebord ${boardThicknessMm}x${boardWidthMm}mm trykkimpregnert rillet`;
        boardWaste = 0.20; // 20% waste
        break;
      case "trykkimpregnert-glatt":
        boardTypeName = `Terrassebord ${boardThicknessMm}x${boardWidthMm}mm trykkimpregnert glatt`;
        boardWaste = 0.20; // 20% waste
        break;
      case "royal":
        boardTypeName = `Terrassebord 34x145mm Royal impregnert`;
        boardWaste = 0.20; // 20% waste
        break;
      case "kebony":
        boardTypeName = `Terrassebord Kebony ${boardThicknessMm}x${boardWidthMm}mm`;
        boardWaste = 0.20; // 20% waste
        break;
      case "kompositt":
        boardTypeName = `Kompositbord ${boardThicknessMm}x${boardWidthMm}mm`;
        boardWaste = 0.20; // 20% waste
        break;
    }

    // Calculate deck boards needed (based on area coverage)
    // Account for gaps between boards (typically 5-7mm)
    const effectiveBoardWidth = boardWidth - 0.006; // 6mm gap
    const boardsNeeded = Math.ceil(width / effectiveBoardWidth);
    const totalBoardLength = Math.ceil(boardsNeeded * length * (1 + boardWaste));
    
    results.push({ 
      name: boardTypeName, 
      quantity: totalBoardLength, 
      unit: "m" 
    });

    // Structural beams/joists calculation
    let beamName = "";
    let beamSpacingMeters = 0;
    
    switch (beamSpacing) {
      case "cc40":
        beamSpacingMeters = 0.40;
        break;
      case "cc60":
        beamSpacingMeters = 0.60;
        break;
    }

    beamName = `Bjelkelag ${beamSize}mm`;
    
    // Calculate number of beams needed based on spacing
    const numberOfBeams = Math.ceil(width / beamSpacingMeters) + 1;
    const beamsLength = numberOfBeams * length;
    
    // Add frame around the deck (perimeter)
    const frameLength = 2 * (length + width);
    
    // Total beam length including frame and 15% waste
    const beamWaste = 0.15; // 15% waste for construction lumber
    const totalBeamLength = Math.ceil((beamsLength + frameLength) * (1 + beamWaste));
    
    results.push({ 
      name: beamName, 
      quantity: totalBeamLength, 
      unit: "m" 
    });

    // Add informational line about frame
    results.push({
      name: "   - herav ramme rundt terrasse",
      quantity: Math.ceil(frameLength),
      unit: "m"
    });

    // Cross bracing (every 2m for stability)
    const crossBracingPieces = Math.ceil(length / 2) * 2;
    const crossBracingLength = Math.ceil(crossBracingPieces * width);
    results.push({ 
      name: `Avstivere ${beamSize}mm`, 
      quantity: crossBracingLength, 
      unit: "m" 
    });

    // Screws for deck boards
    // Typically 2 screws per board per beam crossing
    const screwsForBoards = numberOfBeams * boardsNeeded * 2;
    const screwBoxes = Math.ceil(screwsForBoards / 200); // ~200 screws per box
    results.push({ 
      name: "Terrasseskruer rustfri", 
      quantity: screwBoxes, 
      unit: "pk" 
    });

    // Screws/bolts for structural beams
    const structuralScrews = Math.ceil((totalBeamLength + crossBracingLength) / 0.5); // Every 50cm
    const structuralScrewBoxes = Math.ceil(structuralScrews / 100);
    results.push({ 
      name: "Konstruksjonsskruer 100mm", 
      quantity: structuralScrewBoxes, 
      unit: "pk" 
    });

    // Membrane/weed barrier under deck
    const membraneArea = Math.ceil(area * 1.1); // 10% overlap
    results.push({ 
      name: "Fiberduk/ugrassduk", 
      quantity: membraneArea, 
      unit: "m²" 
    });

    // Railing if selected
    if (includeRailing && railingLength) {
      const railingLengthNum = parseFloat(railingLength);
      if (railingLengthNum > 0) {
        // Railing posts (every 1.5m)
        const railingPosts = Math.ceil(railingLengthNum / 1.5) + 1;
        results.push({ 
          name: "Rekkverksstolper 70x70mm", 
          quantity: railingPosts, 
          unit: "stk" 
        });

        // Top and bottom rails
        const railLength = Math.ceil(railingLengthNum * 2); // Top and bottom
        results.push({ 
          name: "Rekkverk håndlist/sperrebånd", 
          quantity: railLength, 
          unit: "m" 
        });

        // Balusters/spindles (every 12cm for safety)
        const balusters = Math.ceil(railingLengthNum / 0.12);
        results.push({ 
          name: "Spiler til rekkverk", 
          quantity: balusters, 
          unit: "stk" 
        });
      }
    }

    // Treatment/stain (if wood)
    if (deckBoardType !== "kompositt") {
      const treatmentLiters = Math.ceil(area / 8); // ~8m² per liter
      results.push({ 
        name: "Terrasseolje/beis", 
        quantity: treatmentLiters, 
        unit: "liter" 
      });
    }

    // Add waste info
    results.push({ 
      name: "Kapp/svinn terrassebord", 
      quantity: Math.round(boardWaste * 100), 
      unit: "%" 
    });

    results.push({ 
      name: "Kapp/svinn konstruksjonsvirke", 
      quantity: Math.round(beamWaste * 100), 
      unit: "%" 
    });

    setCalcResults(results);
    setShowCalculator(false);
    autoAddCalculatedMaterials(results);
  };

  const calculateCladdingMaterials = () => {
    const length = parseFloat(wallLength);
    const height = parseFloat(wallHeight);
    
    if (!length || length <= 0 || !height || height <= 0) {
      alert("Vennligst oppgi lengde og høyde");
      return;
    }

    const results: CalculatorItem[] = [];
    let area = 0;

    // Calculate area based on wall type
    if (wallType === "gable") {
      const topHeight = parseFloat(gableTopHeight);
      if (!topHeight || topHeight <= 0) {
        alert("Vennligst oppgi mønehøyde for gavlvegg");
        return;
      }
      // Gable wall: rectangle + triangle
      const rectangleArea = length * height;
      const triangleArea = (length * (topHeight - height)) / 2;
      area = rectangleArea + triangleArea;
      
      results.push({
        name: "Gavlvegg total areal",
        quantity: Math.round(area * 100) / 100,
        unit: "m²"
      });
    } else {
      // Regular wall (short or long)
      area = length * height;
      const wallTypeName = wallType === "short" ? "Kortvegg" : "Langvegg";
      results.push({
        name: `${wallTypeName} total areal`,
        quantity: Math.round(area * 100) / 100,
        unit: "m²"
      });
    }

    // Cladding board specifications
    let claddingName = "";
    let coverage = 0; // m² per meter of board
    let wastePercentage = 0.10; // 10% default waste
    
    switch (claddingType) {
      case "standing":
        claddingName = "Stående kledning 23x148mm";
        coverage = 0.14; // ~140mm effective coverage
        wastePercentage = 0.08; // 8% waste for vertical
        break;
      case "dobbelfals":
        claddingName = "Dobbelfals kledning 19x123mm";
        coverage = 0.115; // ~115mm effective coverage (overlaps)
        wastePercentage = 0.12; // 12% waste
        break;
      case "enkelfals":
        claddingName = "Enkelfals kledning 19x123mm";
        coverage = 0.118; // ~118mm effective coverage
        wastePercentage = 0.10; // 10% waste
        break;
    }

    // Calculate cladding boards needed
    const claddingMeters = Math.ceil((area / coverage) * (1 + wastePercentage));
    results.push({
      name: claddingName,
      quantity: claddingMeters,
      unit: "m"
    });

    // Battens/furring strips (for mounting)
    // Typical spacing: every 60cm horizontally
    const battenSpacing = 0.6;
    let battenLength = 0;
    
    if (wallType === "gable") {
      const topHeight = parseFloat(gableTopHeight);
      // For gable: vertical battens + extra for triangle section
      const numberOfBattens = Math.ceil(length / battenSpacing) + 1;
      battenLength = numberOfBattens * height + (numberOfBattens * (topHeight - height) / 2);
    } else {
      // For regular walls
      const numberOfBattens = Math.ceil(length / battenSpacing) + 1;
      battenLength = numberOfBattens * height;
    }
    
    const totalBattenLength = Math.ceil(battenLength * 1.10); // 10% waste
    results.push({
      name: "Kledningslekter 23x48mm",
      quantity: totalBattenLength,
      unit: "m"
    });

    // Wind barrier membrane
    const membraneArea = Math.ceil(area * 1.15); // 15% overlap
    results.push({
      name: "Vindtetting/membran",
      quantity: membraneArea,
      unit: "m²"
    });

    // Nails/screws for cladding
    // Estimate: ~25 nails per m² of cladding
    const nailsNeeded = Math.ceil(area * 25);
    const nailBoxes = Math.ceil(nailsNeeded / 600); // ~600 nails per kg/box
    results.push({
      name: "Spiker/skruer rustfri for kledning",
      quantity: nailBoxes,
      unit: "kg"
    });

    // Nails for battens
    const battenNails = Math.ceil(totalBattenLength / 0.5); // Every 50cm
    const battenNailBoxes = Math.ceil(battenNails / 500);
    results.push({
      name: "Spiker for lekter",
      quantity: battenNailBoxes,
      unit: "kg"
    });

    // Corner trim (inside and outside corners)
    // Estimate 2 corners minimum
    const cornerLength = Math.ceil(height * 2 * 1.05); // 2 corners, 5% waste
    results.push({
      name: "Hjørnelist utvendig/innvendig",
      quantity: cornerLength,
      unit: "m"
    });

    // Treatment/paint for wood cladding
    const treatmentLiters = Math.ceil(area / 6); // ~6m² per liter, 2 coats
    results.push({
      name: "Kledningsolje/maling",
      quantity: treatmentLiters,
      unit: "liter"
    });

    // Add waste info
    results.push({
      name: "Kapp/svinn kledning",
      quantity: Math.round(wastePercentage * 100),
      unit: "%"
    });

    setCalcResults(results);
    setShowCalculator(false);
    autoAddCalculatedMaterials(results);
  };

  const autoAddCalculatedMaterials = (results: CalculatorItem[]) => {
    // Automatically add calculated materials to the materials list
    // This is called after calculateRoofMaterials, calculatePaintingMaterials, and calculateFlooringMaterials
    
    // Filter out informational items
    const materialItems = results.filter(item => 
      !item.name.includes("Grunnflate") && 
      !item.name.includes("Takflate") &&
      !item.name.includes("vinkel") &&
      !item.name.includes("faktor") &&
      !item.name.includes("Kapp/svinn") &&
      !item.name.includes("herav ramme") &&
      item.unit !== "%" &&
      item.unit !== "°" &&
      item.unit !== "grader" &&
      item.unit !== "x"
    );

    if (materialItems.length === 0) {
      return;
    }

    // Create custom materials from calculator results
    const newMaterials = materialItems.map(item => {
      // Try to find matching material in database
      // Flatten the MATERIAL_DATABASE object into an array
      const allMaterials = Object.values(MATERIAL_DATABASE).flat();
      const dbMaterial = allMaterials.find(m => 
        m.name.toLowerCase().includes(item.name.toLowerCase()) ||
        item.name.toLowerCase().includes(m.name.toLowerCase().split(" ")[0])
      );

      const material: Material = {
        id: `calc-${Date.now()}-${Math.random()}`,
        name: item.name,
        category: dbMaterial?.category || "Kalkulert materiale",
        unit: item.unit,
        pricePerUnit: dbMaterial?.pricePerUnit || 0,
        coverage: dbMaterial?.coverage || 0,
      };

      return {
        ...material,
        quantity: item.quantity,
        totalPrice: material.pricePerUnit * item.quantity,
      };
    });

    // Add to selected materials (merge if already exists)
    const updatedMaterials = [...selectedMaterials];
    
    newMaterials.forEach(newMat => {
      const existingIndex = updatedMaterials.findIndex(m => 
        m.name.toLowerCase() === newMat.name.toLowerCase()
      );
      
      if (existingIndex >= 0) {
        // Update quantity if material already exists
        updatedMaterials[existingIndex] = {
          ...updatedMaterials[existingIndex],
          quantity: newMat.quantity,
          totalPrice: updatedMaterials[existingIndex].pricePerUnit * newMat.quantity,
        };
      } else {
        // Add new material
        updatedMaterials.push(newMat);
      }
    });

    setSelectedMaterials(updatedMaterials);
  };

  // Calculate totals
  const materialsCost = selectedMaterials.reduce((sum, m) => sum + m.totalPrice, 0);
  const laborCostNum = parseFloat(laborCost) || 0;
  const subtotal = materialsCost + laborCostNum;
  const mva = subtotal * 0.25;
  const totalPrice = subtotal + mva;

  const handleGenerateWithAI = () => {
    if (!isPro && !demoProMode) {
      alert("AI-assistent er kun tilgjengelig for Pro-kunder");
      return;
    }

    // AI would generate a description based on job details and selected materials
    const aiDescription = `Basert på prosjektet "${job?.title}" vil jeg:

1. Fjerne eksisterende materialer
2. Installere ${selectedMaterials.length > 0 ? selectedMaterials.map(m => `${m.quantity} ${m.unit} ${m.name}`).join(', ') : 'nødvendige materialer'}
3. Kvalitetssikre alt arbeid
4. Rydde opp etter endt arbeid

Alle materialer er inkludert i prisen. Jeg bruker kun materialer av høy kvalitet og arbeidet utføres i henhold til gjeldende forskrifter.`;

    setOfferDescription(aiDescription);
    setShowAIAssistant(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-[#6B7280]">Laster...</div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header variant="simple" title="Feil" onBack={() => navigate("/tilgjengelige-jobber")} />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg border border-red-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mb-3">
              Jobben ble ikke funnet
            </h2>
            <p className="text-[#6B7280] mb-2">
              {error || "Vi kunne ikke laste jobbdetaljer."}
            </p>
            <p className="text-sm text-[#6B7280] mb-6">
              Jobb-ID: <code className="bg-gray-100 px-2 py-1 rounded">{jobId}</code>
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/tilgjengelige-jobber")}
                className="w-full h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
              >
                Se tilgjengelige jobber
              </button>
              <button
                onClick={() => navigate("/debug-jobs")}
                className="w-full h-12 border border-gray-300 text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Gå til debug-side
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header variant="simple" title="Opprett detaljert tilbud" onBack={() => navigate(-1)} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Materials & Calculator */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Summary */}
            {job && (
              <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
                <h2 className="text-xl font-bold text-[#111827] mb-2">{job.title}</h2>
                <p className="text-sm text-[#6B7280] mb-3">{job.description}</p>
                <div className="flex flex-wrap gap-3 text-sm text-[#6B7280]">
                  <span>📍 {job.location}</span>
                  {job.budgetMax && (
                    <span>
                      💰 {job.budgetMin?.toLocaleString("nb-NO")} - {job.budgetMax.toLocaleString("nb-NO")} kr
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-2 flex gap-2">
              <button
                onClick={() => setActiveTab("materials")}
                className={`flex-1 h-10 rounded-lg font-medium transition-colors ${
                  activeTab === "materials"
                    ? "bg-[#17384E] text-white"
                    : "text-[#6B7280] hover:bg-gray-50"
                }`}
              >
                <Package className="w-4 h-4 inline mr-2" />
                Materialer
              </button>
              <button
                onClick={() => setActiveTab("calculator")}
                className={`flex-1 h-10 rounded-lg font-medium transition-colors ${
                  activeTab === "calculator"
                    ? "bg-[#17384E] text-white"
                    : "text-[#6B7280] hover:bg-gray-50"
                }`}
              >
                <Calculator className="w-4 h-4 inline mr-2" />
                Kalkulator
              </button>
            </div>

            {/* Materials Tab */}
            {activeTab === "materials" && (
              <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-[#111827] mb-4">Søk etter materialer</h3>
                  
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                    <input
                      type="text"
                      placeholder="Søk etter materialer (f.eks. takstein, maling, panel...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "tak", label: "Tak" },
                      { id: "maling", label: "Maling" },
                      { id: "trevare", label: "Tømrer/Trevare" },
                      { id: "elektrisk", label: "Elektriker" },
                      { id: "ror", label: "Rørlegger" },
                      { id: "all", label: "Alle" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === cat.id
                            ? "bg-[#17384E] text-white"
                            : "bg-gray-100 text-[#6B7280] hover:bg-gray-200"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Add Custom Material Button */}
                  <button
                    onClick={openCustomMaterialModal}
                    className="w-full mt-2 h-10 border-2 border-dashed border-[#E5E7EB] text-[#6B7280] rounded-lg hover:border-[#17384E] hover:text-[#17384E] transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Legg til egendefinert produkt
                  </button>
                </div>

                {/* Materials List */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {getFilteredMaterials().map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg hover:border-[#17384E] transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-[#111827]">{material.name}</div>
                        <div className="text-sm text-[#6B7280]">
                          {material.category} • {material.pricePerUnit} kr/{material.unit}
                        </div>
                      </div>
                      <button
                        onClick={() => addMaterial(material)}
                        className="h-8 px-4 bg-[#E07B3E] text-white rounded-lg hover:bg-[#d16f35] transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Legg til
                      </button>
                    </div>
                  ))}
                  {getFilteredMaterials().length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-[#6B7280] mb-4">Ingen materialer funnet</div>
                      <button
                        onClick={openCustomMaterialModal}
                        className="h-10 px-6 bg-[#17384E] text-white rounded-lg hover:bg-[#1a4459] transition-colors flex items-center gap-2 mx-auto text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Legg til egendefinert produkt
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Calculator Tab */}
            {activeTab === "calculator" && (
              <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
                <h3 className="text-lg font-bold text-[#111827] mb-4">Mengdekalkulator</h3>
                
                {/* Calculator Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#111827] mb-3">
                    Velg type beregning
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <button
                      onClick={() => setCalculatorType("roof")}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        calculatorType === "roof"
                          ? "border-[#17384E] bg-[#17384E]/5"
                          : "border-[#E5E7EB] hover:border-[#17384E]/50"
                      }`}
                    >
                      <div className="text-2xl mb-2">🏠</div>
                      <div className="font-medium text-sm">Tak</div>
                    </button>
                    <button
                      onClick={() => setCalculatorType("painting")}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        calculatorType === "painting"
                          ? "border-[#17384E] bg-[#17384E]/5"
                          : "border-[#E5E7EB] hover:border-[#17384E]/50"
                      }`}
                    >
                      <div className="text-2xl mb-2">🎨</div>
                      <div className="font-medium text-sm">Maling</div>
                    </button>
                    <button
                      onClick={() => setCalculatorType("flooring")}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        calculatorType === "flooring"
                          ? "border-[#17384E] bg-[#17384E]/5"
                          : "border-[#E5E7EB] hover:border-[#17384E]/50"
                      }`}
                    >
                      <div className="text-2xl mb-2">📐</div>
                      <div className="font-medium text-sm">Gulv</div>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setCalculatorType("deck")}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        calculatorType === "deck"
                          ? "border-[#17384E] bg-[#17384E]/5"
                          : "border-[#E5E7EB] hover:border-[#17384E]/50"
                      }`}
                    >
                      <div className="text-2xl mb-2">🪵</div>
                      <div className="font-medium text-sm">Terrasse</div>
                    </button>
                    <button
                      onClick={() => setCalculatorType("cladding")}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        calculatorType === "cladding"
                          ? "border-[#17384E] bg-[#17384E]/5"
                          : "border-[#E5E7EB] hover:border-[#17384E]/50"
                      }`}
                    >
                      <div className="text-2xl mb-2">🏘️</div>
                      <div className="font-medium text-sm">Kledning</div>
                    </button>
                  </div>
                </div>

                {/* Roof Calculator */}
                {calculatorType === "roof" && (
                  <div className="space-y-4">
                    {/* Roof Type */}
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        Type tak
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setRoofType("saltak")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            roofType === "saltak"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-sm">Saltak</div>
                        </button>
                        <button
                          onClick={() => setRoofType("valm")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            roofType === "valm"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-sm">Valmtak</div>
                        </button>
                      </div>
                    </div>

                    {/* Tile Type */}
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        Type takstein
                      </label>
                      <select
                        value={tileType}
                        onChange={(e) => setTileType(e.target.value)}
                        className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                      >
                        <option value="monier">Monier Novo (10 stk/m²)</option>
                        <option value="optimal">Optimal Protector (9.8 stk/m²)</option>
                        <option value="braas">Braas Turmalin (9.5 stk/m²)</option>
                        <option value="skarpnes-optimal">Skarpnes Optimal (10 stk/m²)</option>
                        <option value="skarpnes-optimal-xl">Skarpnes Optimal XL (9 stk/m²)</option>
                        <option value="skarpnes-topas">Skarpnes Topas (10.5 stk/m²)</option>
                        <option value="skarpnes-ambassador">Skarpnes Ambassador (9.8 stk/m²)</option>
                      </select>
                      
                      {/* Tile type specific info */}
                      <div className="mt-2 p-3 bg-[#F3F4F6] rounded-lg space-y-1">
                        {tileType === "monier" && (
                          <>
                            <div className="text-xs font-medium text-[#111827]">Monier Novo beregningsgrunnlag:</div>
                            <div className="text-xs text-[#6B7280]">• Dekning: 0.33 m²/stein (10 stk/m²)</div>
                            <div className="text-xs text-[#6B7280]">• Fullsten: 87% • Halvsten: 8%</div>
                            <div className="text-xs text-[#6B7280]">• Mønestein: 3 stk/m • Endesten: 3 stk/m</div>
                          </>
                        )}
                        {tileType === "optimal" && (
                          <>
                            <div className="text-xs font-medium text-[#111827]">Optimal Protector beregningsgrunnlag:</div>
                            <div className="text-xs text-[#6B7280]">• Dekning: 0.34 m²/stein (9.8 stk/m²)</div>
                            <div className="text-xs text-[#6B7280]">• Fullsten: 86% • Halvsten: 9%</div>
                            <div className="text-xs text-[#6B7280]">• Mønestein: 2.9 stk/m • Endesten: 2.9 stk/m</div>
                          </>
                        )}
                        {tileType === "braas" && (
                          <>
                            <div className="text-xs font-medium text-[#111827]">Braas Turmalin beregningsgrunnlag:</div>
                            <div className="text-xs text-[#6B7280]">• Dekning: 0.35 m²/stein (9.5 stk/m²)</div>
                            <div className="text-xs text-[#6B7280]">• Fullsten: 84% • Halvsten: 11%</div>
                            <div className="text-xs text-[#6B7280]">• Mønestein: 2.8 stk/m • Endesten: 2.8 stk/m</div>
                          </>
                        )}
                        {tileType === "skarpnes-optimal" && (
                          <>
                            <div className="text-xs font-medium text-[#111827]">Skarpnes Optimal beregningsgrunnlag:</div>
                            <div className="text-xs text-[#6B7280]">• Dekning: 0.33 m²/stein (10 stk/m²)</div>
                            <div className="text-xs text-[#6B7280]">• Fullsten: 87% • Halvsten: 8%</div>
                            <div className="text-xs text-[#6B7280]">• Mønestein: 3 stk/m • Endesten: 3 stk/m</div>
                          </>
                        )}
                        {tileType === "skarpnes-optimal-xl" && (
                          <>
                            <div className="text-xs font-medium text-[#111827]">Skarpnes Optimal XL beregningsgrunnlag:</div>
                            <div className="text-xs text-[#6B7280]">• Dekning: 0.36 m²/stein (9 stk/m²)</div>
                            <div className="text-xs text-[#6B7280]">• Fullsten: 85% • Halvsten: 10%</div>
                            <div className="text-xs text-[#6B7280]">• Mønestein: 2.8 stk/m • Endesten: 2.8 stk/m</div>
                          </>
                        )}
                        {tileType === "skarpnes-topas" && (
                          <>
                            <div className="text-xs font-medium text-[#111827]">Skarpnes Topas beregningsgrunnlag:</div>
                            <div className="text-xs text-[#6B7280]">• Dekning: 0.31 m²/stein (10.5 stk/m²)</div>
                            <div className="text-xs text-[#6B7280]">• Fullsten: 88% • Halvsten: 7%</div>
                            <div className="text-xs text-[#6B7280]">• Mønestein: 3.1 stk/m • Endesten: 3.1 stk/m</div>
                          </>
                        )}
                        {tileType === "skarpnes-ambassador" && (
                          <>
                            <div className="text-xs font-medium text-[#111827]">Skarpnes Ambassador beregningsgrunnlag:</div>
                            <div className="text-xs text-[#6B7280]">• Dekning: 0.34 m²/stein (9.8 stk/m²)</div>
                            <div className="text-xs text-[#6B7280]">• Fullsten: 86% • Halvsten: 9%</div>
                            <div className="text-xs text-[#6B7280]">• Mønestein: 2.9 stk/m • Endesten: 2.9 stk/m</div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Include End Tiles Option */}
                    <div className="border border-[#E5E7EB] rounded-lg p-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeEndTiles}
                          onChange={(e) => setIncludeEndTiles(e.target.checked)}
                          className="w-5 h-5 rounded border-[#E5E7EB] text-[#17384E] focus:ring-2 focus:ring-[#17384E]"
                        />
                        <div>
                          <div className="text-sm font-medium text-[#111827]">
                            Inkluder endesten
                          </div>
                          <div className="text-xs text-[#6B7280] mt-0.5">
                            Brukes på gavlene (endene av huset) - kun for saltak
                          </div>
                        </div>
                      </label>
                      {roofType === "valm" && includeEndTiles && (
                        <div className="mt-2 p-2 bg-[#E07B3E]/10 rounded text-xs text-[#E07B3E]">
                          ⚠️ Valmtak har ikke gavler - endesten vil ikke bli beregnet
                        </div>
                      )}
                    </div>

                    {/* Storm Clips Intensity */}
                    <div className="border border-[#E5E7EB] rounded-lg p-4">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-[#111827] mb-2">
                          Stormklips-intensitet
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setStormClipsIntensity("standard")}
                            className={`p-3 border-2 rounded-lg transition-colors ${
                              stormClipsIntensity === "standard"
                                ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                                : "border-[#E5E7EB] hover:border-[#17384E]/50"
                            }`}
                          >
                            <div className="text-xs font-medium">Standard</div>
                            <div className="text-xs text-[#6B7280] mt-1">~35%</div>
                          </button>
                          <button
                            onClick={() => setStormClipsIntensity("medium")}
                            className={`p-3 border-2 rounded-lg transition-colors ${
                              stormClipsIntensity === "medium"
                                ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                                : "border-[#E5E7EB] hover:border-[#17384E]/50"
                            }`}
                          >
                            <div className="text-xs font-medium">Middels</div>
                            <div className="text-xs text-[#6B7280] mt-1">~50%</div>
                          </button>
                          <button
                            onClick={() => setStormClipsIntensity("high")}
                            className={`p-3 border-2 rounded-lg transition-colors ${
                              stormClipsIntensity === "high"
                                ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                                : "border-[#E5E7EB] hover:border-[#17384E]/50"
                            }`}
                          >
                            <div className="text-xs font-medium">Høy</div>
                            <div className="text-xs text-[#6B7280] mt-1">100%</div>
                          </button>
                        </div>
                      </div>
                      <div className="p-3 bg-[#F3F4F6] rounded-lg space-y-1">
                        <div className="text-xs font-medium text-[#111827]">Beregningsgrunnlag:</div>
                        <div className="text-xs text-[#6B7280]">• Randsoner (gavl/takfot): 100% - hver stein</div>
                        <div className="text-xs text-[#6B7280]">• Møne/rygger: 100% - alle stein</div>
                        <div className="text-xs text-[#6B7280]">• Midtparti: {
                          stormClipsIntensity === "standard" ? "~35% (hver 3. stein)" :
                          stormClipsIntensity === "medium" ? "~50% (annenhver stein)" :
                          "100% (alle stein - utsatte områder)"
                        }</div>
                        <div className="text-xs text-[#6B7280] mt-2 pt-2 border-t border-[#E5E7EB]">
                          💡 Høy intensitet anbefales for åpent landskap og høye tak
                        </div>
                      </div>
                    </div>

                    {/* Area Input Options */}
                    <div className="border border-[#E5E7EB] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-[#111827]">
                          Grunnflate (horisontalmål)
                        </div>
                        <div className="text-xs text-[#6B7280] bg-[#F3F4F6] px-2 py-1 rounded">
                          velg én metode
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-[#6B7280] mb-1">
                            Direkte areal (m²)
                          </label>
                          <input
                            type="number"
                            placeholder="f.eks. 150"
                            value={calcArea}
                            onChange={(e) => setCalcArea(e.target.value)}
                            className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                          />
                        </div>

                        <div className="text-center text-xs text-[#6B7280]">eller</div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-[#6B7280] mb-1">
                              Lengde (m)
                            </label>
                            <input
                              type="number"
                              placeholder="f.eks. 15"
                              value={calcLength}
                              onChange={(e) => setCalcLength(e.target.value)}
                              className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#6B7280] mb-1">
                              Bredde (m)
                            </label>
                            <input
                              type="number"
                              placeholder="f.eks. 10"
                              value={calcWidth}
                              onChange={(e) => setCalcWidth(e.target.value)}
                              className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                        <div className="text-xs text-[#6B7280]">
                          💡 Takflate beregnes automatisk basert på grunnflate, vinkel og taktype
                        </div>
                      </div>
                    </div>

                    {/* Angle Input Options */}
                    <div className="border border-[#E5E7EB] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-[#111827]">
                          Takvinkel
                        </div>
                        <button
                          onClick={() => setUseAngleCalc(!useAngleCalc)}
                          className="text-xs text-[#E07B3E] hover:underline"
                        >
                          {useAngleCalc ? "Oppgi direkte" : "Beregn fra høyde"}
                        </button>
                      </div>

                      {!useAngleCalc ? (
                        <div>
                          <label className="block text-xs text-[#6B7280] mb-1">
                            Vinkel (grader)
                          </label>
                          <input
                            type="number"
                            placeholder="f.eks. 25"
                            value={roofAngle}
                            onChange={(e) => setRoofAngle(e.target.value)}
                            className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                          />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-[#F3F4F6] rounded p-2 text-xs text-[#6B7280]">
                            Beregner vinkel fra høydeforskjell (bunn til topp av møne)
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-[#6B7280] mb-1">
                                Høyde (m)
                              </label>
                              <input
                                type="number"
                                placeholder="f.eks. 2.5"
                                value={roofHeight}
                                onChange={(e) => setRoofHeight(e.target.value)}
                                className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-[#6B7280] mb-1">
                                Bredde/base (m)
                              </label>
                              <input
                                type="number"
                                placeholder="f.eks. 10"
                                value={roofBase}
                                onChange={(e) => setRoofBase(e.target.value)}
                                className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-[#E07B3E]/10 border border-[#E07B3E]/20 rounded-lg p-4">
                      <div className="text-sm font-medium text-[#111827] mb-2">
                        Kalkulatoren beregner:
                      </div>
                      <ul className="text-xs text-[#6B7280] space-y-1">
                        <li>✓ Grunnflate (Lengde × Bredde)</li>
                        <li>✓ Takflate (justert for vinkel og taktype)</li>
                        <li>✓ Fullsten & Halvsten (spesifikk for {
                          tileType === "monier" ? "Monier Novo" :
                          tileType === "optimal" ? "Optimal Protector" :
                          tileType === "braas" ? "Braas Turmalin" :
                          tileType === "skarpnes-optimal" ? "Skarpnes Optimal" :
                          tileType === "skarpnes-optimal-xl" ? "Skarpnes Optimal XL" :
                          tileType === "skarpnes-topas" ? "Skarpnes Topas" :
                          tileType === "skarpnes-ambassador" ? "Skarpnes Ambassador" :
                          "Takstein"
                        })</li>
                        {includeEndTiles && roofType === "saltak" && <li>✓ Endesten (på gavler)</li>}
                        <li>✓ Mønestein (mønelengde spesifikk for valgt takstein)</li>
                        <li>✓ Stormklips (randsoner 100%, møne 100%, midtparti {
                          stormClipsIntensity === "standard" ? "~35%" :
                          stormClipsIntensity === "medium" ? "~50%" :
                          "100%"
                        })</li>
                        <li>✓ Takrenner (beregnet omkrets)</li>
                        <li>✓ Takrennehjørner, Nedløpsrør (5m per hjørne)</li>
                        <li>✓ Nedløpsstykker, Rennekroker (1 per 60cm)</li>
                        <li>✓ Skjøtestykker (1 per 3m takrenne)</li>
                        <li>✓ Fotbeslag 2m (standard lengde)</li>
                        <li>✓ Undertak (justert for takvinkel + 10% svinn)</li>
                        <li>✓ Lekter (med 35cm avstand)</li>
                      </ul>
                      <div className="mt-3 pt-3 border-t border-[#E07B3E]/20 space-y-2">
                        {roofType === "valm" && (
                          <div className="text-xs text-[#6B7280]">
                            <strong>Valmtak:</strong> +5% ekstra takflate for hofter
                          </div>
                        )}
                        <div className="text-xs text-[#6B7280]">
                          <strong>Svinn:</strong> +5% ekstra takstein inkludert automatisk
                        </div>
                        <div className="text-xs text-[#6B7280]">
                          💡 Hver taksteinstype har unike dekningsgrader og mønestein-spacing
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={calculateRoofMaterials}
                      className="w-full h-12 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors"
                    >
                      Beregn materialer
                    </button>

                    {/* Results Display */}
                    {calcResults.length > 0 && (
                      <div className="border-t border-[#E5E7EB] pt-4 mt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-semibold text-[#111827]">
                            Kalkulerte mengder:
                          </div>
                          <div className="text-xs bg-[#17384E] text-white px-3 py-1 rounded-full">
                            {tileType === "monier" ? "Monier Novo" :
                             tileType === "optimal" ? "Optimal Protector" :
                             "Braas Turmalin"}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {calcResults.map((result, index) => (
                            <div
                              key={index}
                              className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                                result.name.includes("Grunnflate") || result.name.includes("Takflate")
                                  ? "bg-[#17384E]/10 border border-[#17384E]/30"
                                  : result.name.includes("vinkel") || result.name.includes("faktor")
                                  ? "bg-[#E07B3E]/10 border border-[#E07B3E]/20"
                                  : "bg-[#F3F4F6]"
                              }`}
                            >
                              <span className={`text-sm font-medium ${
                                result.name.includes("Grunnflate") || result.name.includes("Takflate")
                                  ? "text-[#17384E] font-semibold"
                                  : "text-[#111827]"
                              }`}>
                                {result.name}
                              </span>
                              <span className={`text-sm font-bold ${
                                result.name.includes("Grunnflate") || result.name.includes("Takflate")
                                  ? "text-[#17384E]"
                                  : "text-[#E07B3E]"
                              }`}>
                                {result.quantity} {result.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={addCalculatorResultsToMaterials}
                          className="w-full mt-4 h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-5 h-5" />
                          Legg til i materialliste
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Painting Calculator */}
                {calculatorType === "painting" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        Maleareal (m²)
                      </label>
                      <input
                        type="number"
                        placeholder="f.eks. 80"
                        value={calcArea}
                        onChange={(e) => setCalcArea(e.target.value)}
                        className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                      />
                    </div>

                    <div className="bg-[#F3F4F6] rounded-lg p-4">
                      <div className="text-sm font-medium text-[#111827] mb-2">
                        Automatisk beregning inkluderer:
                      </div>
                      <ul className="text-sm text-[#6B7280] space-y-1">
                        <li>• Maling (dekningsgrad: 10m² per liter)</li>
                        <li>• Grunning (dekningsgrad: 8m² per liter)</li>
                      </ul>
                    </div>

                    <button
                      onClick={calculatePaintingMaterials}
                      className="w-full h-12 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors"
                    >
                      Beregn materialer
                    </button>
                  </div>
                )}

                {/* Flooring Calculator */}
                {calculatorType === "flooring" && (
                  <div className="space-y-4">
                    {/* Floor Type */}
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        Type gulv
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setFloorType("laminat")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            floorType === "laminat"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs">Laminat</div>
                        </button>
                        <button
                          onClick={() => setFloorType("parkett")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            floorType === "parkett"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs">Parkett</div>
                        </button>
                        <button
                          onClick={() => setFloorType("vinyl")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            floorType === "vinyl"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs">Vinyl</div>
                        </button>
                      </div>
                    </div>

                    {/* Laying Pattern */}
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        Leggingsmønster
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setLayingPattern("rett")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            layingPattern === "rett"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-2xl mb-1">━</div>
                          <div className="text-xs">Rett</div>
                          <div className="text-xs text-[#6B7280]">7% kapp</div>
                        </button>
                        <button
                          onClick={() => setLayingPattern("diagonal")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            layingPattern === "diagonal"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-2xl mb-1">╱</div>
                          <div className="text-xs">Diagonal</div>
                          <div className="text-xs text-[#6B7280]">12% kapp</div>
                        </button>
                        <button
                          onClick={() => setLayingPattern("fiskeben")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            layingPattern === "fiskeben"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-2xl mb-1">⋮</div>
                          <div className="text-xs">Fiskeben</div>
                          <div className="text-xs text-[#6B7280]">18% kapp</div>
                        </button>
                      </div>
                    </div>

                    {/* Area Input Options */}
                    <div className="border border-[#E5E7EB] rounded-lg p-4">
                      <div className="text-sm font-medium text-[#111827] mb-3">
                        Areal (velg én metode)
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-[#6B7280] mb-1">
                            Direkte areal (m²)
                          </label>
                          <input
                            type="number"
                            placeholder="f.eks. 60"
                            value={calcArea}
                            onChange={(e) => setCalcArea(e.target.value)}
                            className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                          />
                        </div>

                        <div className="text-center text-xs text-[#6B7280]">eller</div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-[#6B7280] mb-1">
                              Lengde (m)
                            </label>
                            <input
                              type="number"
                              placeholder="f.eks. 10"
                              value={calcLength}
                              onChange={(e) => setCalcLength(e.target.value)}
                              className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#6B7280] mb-1">
                              Bredde (m)
                            </label>
                            <input
                              type="number"
                              placeholder="f.eks. 6"
                              value={calcWidth}
                              onChange={(e) => setCalcWidth(e.target.value)}
                              className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Options */}
                    <div className="border border-[#E5E7EB] rounded-lg p-4">
                      <div className="text-sm font-medium text-[#111827] mb-3">
                        Ekstra komponenter
                      </div>
                      
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeBaseboards}
                            onChange={(e) => setIncludeBaseboards(e.target.checked)}
                            className="w-5 h-5 rounded border-[#E5E7EB] text-[#17384E] focus:ring-2 focus:ring-[#17384E]"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-[#111827]">Gulvlister</div>
                            <div className="text-xs text-[#6B7280]">Beregner omkrets + hjørner</div>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeTransition}
                            onChange={(e) => setIncludeTransition(e.target.checked)}
                            className="w-5 h-5 rounded border-[#E5E7EB] text-[#17384E] focus:ring-2 focus:ring-[#17384E]"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-[#111827]">Overgangslister</div>
                            <div className="text-xs text-[#6B7280]">For dører og rom-overganger</div>
                          </div>
                        </label>

                        {includeTransition && (
                          <div className="ml-8">
                            <label className="block text-xs text-[#6B7280] mb-1">
                              Antall dører/overganger
                            </label>
                            <input
                              type="number"
                              placeholder="1"
                              value={numberOfDoors}
                              onChange={(e) => setNumberOfDoors(e.target.value)}
                              className="w-24 h-8 px-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                            />
                          </div>
                        )}

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeMoisture}
                            onChange={(e) => setIncludeMoisture(e.target.checked)}
                            className="w-5 h-5 rounded border-[#E5E7EB] text-[#17384E] focus:ring-2 focus:ring-[#17384E]"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-[#111827]">Dampsperre</div>
                            <div className="text-xs text-[#6B7280]">For betongunderlag</div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-[#E07B3E]/10 border border-[#E07B3E]/20 rounded-lg p-4">
                      <div className="text-sm font-medium text-[#111827] mb-2">
                        Kalkulatoren beregner:
                      </div>
                      <ul className="text-xs text-[#6B7280] space-y-1">
                        <li>✓ Gulvareal med smart kapp-% (basert på mønster)</li>
                        <li>✓ Gulvunderlag (1:1 med gulv)</li>
                        {includeBaseboards && <li>✓ Gulvlister, hjørner og endestykker</li>}
                        {includeTransition && <li>✓ Overgangslister</li>}
                        {includeMoisture && <li>✓ Dampsperre med overlapp</li>}
                        {(floorType === "vinyl" || floorType === "parkett") && <li>✓ Gulvlim (ca. 15m² per enhet)</li>}
                      </ul>
                    </div>

                    <button
                      onClick={calculateFlooringMaterials}
                      className="w-full h-12 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors"
                    >
                      Beregn materialer
                    </button>

                    {/* Results Display */}
                    {calcResults.length > 0 && (
                      <div className="border-t border-[#E5E7EB] pt-4 mt-4">
                        <div className="text-sm font-semibold text-[#111827] mb-3">
                          Kalkulerte mengder:
                        </div>
                        <div className="space-y-2">
                          {calcResults.map((result, index) => (
                            <div
                              key={index}
                              className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                                result.unit === "%" 
                                  ? "bg-[#E07B3E]/10 border border-[#E07B3E]/20" 
                                  : "bg-[#F3F4F6]"
                              }`}
                            >
                              <span className="text-sm text-[#111827] font-medium">
                                {result.name}
                              </span>
                              <span className="text-sm text-[#E07B3E] font-bold">
                                {result.quantity} {result.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={addCalculatorResultsToMaterials}
                          className="w-full mt-4 h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-5 h-5" />
                          Legg til i materialliste
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Deck/Terrasse Calculator */}
                {calculatorType === "deck" && (
                  <div className="space-y-4">
                    {/* Deck Board Type */}
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        Type terrassebord
                      </label>
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <button
                          onClick={() => setDeckBoardType("trykkimpregnert-rillet")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            deckBoardType === "trykkimpregnert-rillet"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs">Trykkimpregnert rillet</div>
                        </button>
                        <button
                          onClick={() => setDeckBoardType("trykkimpregnert-glatt")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            deckBoardType === "trykkimpregnert-glatt"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs">Trykkimpregnert glatt</div>
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setDeckBoardType("royal")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            deckBoardType === "royal"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs">Royal impregnert</div>
                        </button>
                        <button
                          onClick={() => setDeckBoardType("kebony")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            deckBoardType === "kebony"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs">Kebony</div>
                        </button>
                        <button
                          onClick={() => setDeckBoardType("kompositt")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            deckBoardType === "kompositt"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs">Kompositt</div>
                        </button>
                      </div>
                    </div>

                    {/* Board Size Selection */}
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        Dimensjon terrassebord
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setDeckBoardSize("28x120")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            deckBoardSize === "28x120"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs font-medium">28x120mm</div>
                        </button>
                        <button
                          onClick={() => setDeckBoardSize("28x145")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            deckBoardSize === "28x145"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs font-medium">28x145mm</div>
                          <div className="text-xs text-[#6B7280]">Standard</div>
                        </button>
                        <button
                          onClick={() => setDeckBoardSize("34x145")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            deckBoardSize === "34x145"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs font-medium">34x145mm</div>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <button
                          onClick={() => setDeckBoardSize("48x145")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            deckBoardSize === "48x145"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs font-medium">48x145mm</div>
                          <div className="text-xs text-[#6B7280]">Ekstra kraftig</div>
                        </button>
                        <button
                          onClick={() => setDeckBoardSize("25x140")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            deckBoardSize === "25x140"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs font-medium">25x140mm</div>
                          <div className="text-xs text-[#6B7280]">Kompositt</div>
                        </button>
                      </div>
                    </div>

                    {/* Structural Beam Size */}
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        Bærende konstruksjon
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setBeamSize("48x98")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            beamSize === "48x98"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs font-medium">48x98mm</div>
                        </button>
                        <button
                          onClick={() => setBeamSize("48x148")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            beamSize === "48x148"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs font-medium">48x148mm</div>
                        </button>
                        <button
                          onClick={() => setBeamSize("48x198")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            beamSize === "48x198"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs font-medium">48x198mm</div>
                        </button>
                      </div>
                    </div>

                    {/* Beam Spacing (CC) */}
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        CC-avstand bjelker
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setBeamSpacing("cc40")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            beamSpacing === "cc40"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-sm font-medium">CC40 (40cm)</div>
                          <div className="text-xs text-[#6B7280]">Sterkere konstruksjon</div>
                        </button>
                        <button
                          onClick={() => setBeamSpacing("cc60")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            beamSpacing === "cc60"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-sm font-medium">CC60 (60cm)</div>
                          <div className="text-xs text-[#6B7280]">Standard</div>
                        </button>
                      </div>
                    </div>

                    {/* Dimensions */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">
                          Lengde (m)
                        </label>
                        <input
                          type="number"
                          placeholder="f.eks. 6"
                          value={calcLength}
                          onChange={(e) => setCalcLength(e.target.value)}
                          className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">
                          Bredde (m)
                        </label>
                        <input
                          type="number"
                          placeholder="f.eks. 4"
                          value={calcWidth}
                          onChange={(e) => setCalcWidth(e.target.value)}
                          className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                        />
                      </div>
                    </div>

                    {/* Optional Railing */}
                    <div className="border-t border-[#E5E7EB] pt-4">
                      <label className="flex items-center gap-3 cursor-pointer mb-3">
                        <input
                          type="checkbox"
                          checked={includeRailing}
                          onChange={(e) => setIncludeRailing(e.target.checked)}
                          className="w-5 h-5 rounded border-[#E5E7EB] text-[#17384E] focus:ring-2 focus:ring-[#17384E]"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#111827]">Rekkverk</div>
                          <div className="text-xs text-[#6B7280]">Inkluder stolper, spiler og håndlister</div>
                        </div>
                      </label>

                      {includeRailing && (
                        <div className="ml-8">
                          <label className="block text-xs text-[#6B7280] mb-1">
                            Lengde rekkverk (m)
                          </label>
                          <input
                            type="number"
                            placeholder="f.eks. 10"
                            value={railingLength}
                            onChange={(e) => setRailingLength(e.target.value)}
                            className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                          />
                        </div>
                      )}
                    </div>

                    <div className="bg-[#E07B3E]/10 border border-[#E07B3E]/20 rounded-lg p-4">
                      <div className="text-sm font-medium text-[#111827] mb-2">
                        Kalkulatoren beregner:
                      </div>
                      <ul className="text-xs text-[#6B7280] space-y-1">
                        <li>✓ Terrassebord inkl. 20% kapp/svinn</li>
                        <li>✓ Bjelkelag (CC-avstand) + ramme rundt terrassen inkl. 15% svinn</li>
                        <li>✓ Avstivere for stabilitet</li>
                        <li>✓ Terrasseskruer rustfri</li>
                        <li>✓ Konstruksjonsskruer for bæring</li>
                        <li>✓ Fiberduk/ugrassduk under terrasse</li>
                        {includeRailing && <li>✓ Kompllett rekkverk med stolper og spiler</li>}
                        {deckBoardType !== "kompositt" && <li>✓ Terrasseolje/beis for behandling</li>}
                      </ul>
                    </div>

                    <button
                      onClick={calculateDeckMaterials}
                      className="w-full h-12 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors"
                    >
                      Beregn materialer
                    </button>

                    {/* Results Display */}
                    {calcResults.length > 0 && (
                      <div className="border-t border-[#E5E7EB] pt-4 mt-4">
                        <div className="text-sm font-semibold text-[#111827] mb-3">
                          Kalkulerte mengder:
                        </div>
                        <div className="space-y-2">
                          {calcResults.map((result, index) => (
                            <div
                              key={index}
                              className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                                result.unit === "%" 
                                  ? "bg-[#E07B3E]/10 border border-[#E07B3E]/20" 
                                  : "bg-[#F3F4F6]"
                              }`}
                            >
                              <span className="text-sm text-[#111827] font-medium">
                                {result.name}
                              </span>
                              <span className="text-sm text-[#E07B3E] font-bold">
                                {result.quantity} {result.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={addCalculatorResultsToMaterials}
                          className="w-full mt-4 h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-5 h-5" />
                          Legg til i materialliste
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Cladding/Kledning Calculator */}
                {calculatorType === "cladding" && (
                  <div className="space-y-4">
                    {/* Cladding Type */}
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        Type kledning
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setCladdingType("standing")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            claddingType === "standing"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs font-medium">Stående kledning</div>
                          <div className="text-xs text-[#6B7280]">23x148mm</div>
                        </button>
                        <button
                          onClick={() => setCladdingType("dobbelfals")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            claddingType === "dobbelfals"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs font-medium">Dobbelfals</div>
                          <div className="text-xs text-[#6B7280]">19x123mm</div>
                        </button>
                        <button
                          onClick={() => setCladdingType("enkelfals")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            claddingType === "enkelfals"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs font-medium">Enkelfals</div>
                          <div className="text-xs text-[#6B7280]">19x123mm</div>
                        </button>
                      </div>
                    </div>

                    {/* Wall Type */}
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        Type vegg
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setWallType("gable")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            wallType === "gable"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs font-medium">Gavlvegg</div>
                          <div className="text-xs text-[#6B7280]">Med trekant</div>
                        </button>
                        <button
                          onClick={() => setWallType("short")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            wallType === "short"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs font-medium">Kortvegg</div>
                          <div className="text-xs text-[#6B7280]">Rektangel</div>
                        </button>
                        <button
                          onClick={() => setWallType("long")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            wallType === "long"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs font-medium">Langvegg</div>
                          <div className="text-xs text-[#6B7280]">Rektangel</div>
                        </button>
                      </div>

                      {/* Visual Illustration of Wall Shape */}
                      <div className="bg-gradient-to-br from-[#17384E]/5 to-[#E07B3E]/5 rounded-lg p-6 border border-[#17384E]/10">
                        <div className="text-xs font-medium text-[#111827] mb-3 text-center">
                          Illustrasjon av veggform som beregnes:
                        </div>
                        
                        {wallType === "gable" && (
                          <div className="flex flex-col items-center">
                            <svg width="180" height="140" viewBox="0 0 180 140" className="mb-2">
                              {/* Rectangle base */}
                              <rect 
                                x="20" 
                                y="60" 
                                width="140" 
                                height="70" 
                                fill="#17384E" 
                                fillOpacity="0.2"
                                stroke="#17384E" 
                                strokeWidth="2"
                              />
                              {/* Triangle top */}
                              <polygon 
                                points="20,60 90,10 160,60" 
                                fill="#E07B3E" 
                                fillOpacity="0.3"
                                stroke="#E07B3E" 
                                strokeWidth="2"
                              />
                              {/* Dimension lines */}
                              <line x1="15" y1="130" x2="15" y2="60" stroke="#6B7280" strokeWidth="1" strokeDasharray="2,2" />
                              <text x="5" y="95" fontSize="10" fill="#6B7280">H</text>
                              
                              <line x1="15" y1="60" x2="15" y2="10" stroke="#E07B3E" strokeWidth="1" strokeDasharray="2,2" />
                              <text x="5" y="35" fontSize="10" fill="#E07B3E">M</text>
                              
                              <line x1="20" y1="135" x2="160" y2="135" stroke="#6B7280" strokeWidth="1" strokeDasharray="2,2" />
                              <text x="85" y="137" fontSize="10" fill="#6B7280" textAnchor="middle">L</text>
                            </svg>
                            <div className="text-xs text-[#6B7280] text-center space-y-1">
                              <div><span className="font-medium text-[#111827]">L</span> = Lengde/bredde</div>
                              <div><span className="font-medium text-[#111827]">H</span> = Høyde til takfot</div>
                              <div><span className="font-medium text-[#E07B3E]">M</span> = Høyde til møne</div>
                              <div className="mt-2 text-[#17384E] font-medium">Areal = (L × H) + (L × (M-H) / 2)</div>
                            </div>
                          </div>
                        )}

                        {wallType === "short" && (
                          <div className="flex flex-col items-center">
                            <svg width="140" height="140" viewBox="0 0 140 140" className="mb-2">
                              {/* Square */}
                              <rect 
                                x="25" 
                                y="25" 
                                width="90" 
                                height="90" 
                                fill="#17384E" 
                                fillOpacity="0.2"
                                stroke="#17384E" 
                                strokeWidth="2"
                              />
                              {/* Dimension lines */}
                              <line x1="20" y1="25" x2="20" y2="115" stroke="#6B7280" strokeWidth="1" strokeDasharray="2,2" />
                              <text x="10" y="70" fontSize="10" fill="#6B7280">H</text>
                              
                              <line x1="25" y1="120" x2="115" y2="120" stroke="#6B7280" strokeWidth="1" strokeDasharray="2,2" />
                              <text x="70" y="132" fontSize="10" fill="#6B7280" textAnchor="middle">L</text>
                            </svg>
                            <div className="text-xs text-[#6B7280] text-center space-y-1">
                              <div><span className="font-medium text-[#111827]">L</span> = Lengde/bredde (ca. likt)</div>
                              <div><span className="font-medium text-[#111827]">H</span> = Høyde</div>
                              <div className="mt-2 text-[#17384E] font-medium">Areal = L × H</div>
                            </div>
                          </div>
                        )}

                        {wallType === "long" && (
                          <div className="flex flex-col items-center">
                            <svg width="200" height="120" viewBox="0 0 200 120" className="mb-2">
                              {/* Rectangle (horizontal) */}
                              <rect 
                                x="20" 
                                y="35" 
                                width="160" 
                                height="60" 
                                fill="#17384E" 
                                fillOpacity="0.2"
                                stroke="#17384E" 
                                strokeWidth="2"
                              />
                              {/* Dimension lines */}
                              <line x1="15" y1="35" x2="15" y2="95" stroke="#6B7280" strokeWidth="1" strokeDasharray="2,2" />
                              <text x="8" y="65" fontSize="10" fill="#6B7280">H</text>
                              
                              <line x1="20" y1="100" x2="180" y2="100" stroke="#6B7280" strokeWidth="1" strokeDasharray="2,2" />
                              <text x="100" y="112" fontSize="10" fill="#6B7280" textAnchor="middle">L</text>
                            </svg>
                            <div className="text-xs text-[#6B7280] text-center space-y-1">
                              <div><span className="font-medium text-[#111827]">L</span> = Lengde (lang side)</div>
                              <div><span className="font-medium text-[#111827]">H</span> = Høyde</div>
                              <div className="mt-2 text-[#17384E] font-medium">Areal = L × H</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Wall Dimensions */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">
                          Lengde/bredde vegg (m)
                        </label>
                        <input
                          type="number"
                          placeholder="f.eks. 8"
                          value={wallLength}
                          onChange={(e) => setWallLength(e.target.value)}
                          className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">
                          Høyde til takfot (m)
                        </label>
                        <input
                          type="number"
                          placeholder="f.eks. 3"
                          value={wallHeight}
                          onChange={(e) => setWallHeight(e.target.value)}
                          className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                        />
                      </div>
                    </div>

                    {/* Gable Top Height (only for gable walls) */}
                    {wallType === "gable" && (
                      <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">
                          Høyde til møne (m)
                        </label>
                        <input
                          type="number"
                          placeholder="f.eks. 5"
                          value={gableTopHeight}
                          onChange={(e) => setGableTopHeight(e.target.value)}
                          className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                        />
                        <div className="text-xs text-[#6B7280] mt-1">
                          Høyden fra bakken til toppen av gavltrekanten
                        </div>
                      </div>
                    )}

                    <div className="bg-[#E07B3E]/10 border border-[#E07B3E]/20 rounded-lg p-4">
                      <div className="text-sm font-medium text-[#111827] mb-2">
                        Kalkulatoren beregner:
                      </div>
                      <ul className="text-xs text-[#6B7280] space-y-1">
                        <li>✓ Kledningspanel med kapp/svinn</li>
                        <li>✓ Kledningslekter 23x48mm</li>
                        <li>✓ Vindtetting/membran</li>
                        <li>✓ Spiker/skruer rustfri</li>
                        <li>✓ Hjørnelister</li>
                        <li>✓ Kledningsolje/maling</li>
                      </ul>
                    </div>

                    <button
                      onClick={calculateCladdingMaterials}
                      className="w-full h-12 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors"
                    >
                      Beregn materialer
                    </button>

                    {/* Results Display */}
                    {calcResults.length > 0 && (
                      <div className="border-t border-[#E5E7EB] pt-4 mt-4">
                        <div className="text-sm font-semibold text-[#111827] mb-3">
                          Kalkulerte mengder:
                        </div>
                        <div className="space-y-2">
                          {calcResults.map((result, index) => (
                            <div
                              key={index}
                              className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                                result.unit === "%" 
                                  ? "bg-[#E07B3E]/10 border border-[#E07B3E]/20" 
                                  : "bg-[#F3F4F6]"
                              }`}
                            >
                              <span className="text-sm text-[#111827] font-medium">
                                {result.name}
                              </span>
                              <span className="text-sm text-[#E07B3E] font-bold">
                                {result.quantity} {result.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={addCalculatorResultsToMaterials}
                          className="w-full mt-4 h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-5 h-5" />
                          Legg til i materialliste
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Selected Materials & Offer */}
          <div className="space-y-6">
            {/* Selected Materials */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <h3 className="text-lg font-bold text-[#111827] mb-4">
                Valgte materialer ({selectedMaterials.length})
              </h3>

              {selectedMaterials.length === 0 ? (
                <div className="text-center py-8 text-[#6B7280] text-sm">
                  Ingen materialer valgt ennå
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="border border-[#E5E7EB] rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm text-[#111827]">
                            {material.name}
                          </div>
                          <button
                            onClick={() => {
                              setEditingMaterial(material);
                              setEditedPrice(material.pricePerUnit.toString());
                              setEditedQuantity(material.quantity.toString());
                              setShowPriceEditModal(true);
                            }}
                            className="text-xs text-[#E07B3E] hover:underline mt-1"
                          >
                            {material.pricePerUnit} kr/{material.unit} • Rediger pris
                          </button>
                        </div>
                        <button
                          onClick={() => removeMaterial(material.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={material.quantity}
                          onChange={(e) =>
                            updateMaterialQuantity(material.id, parseInt(e.target.value))
                          }
                          className="w-20 h-8 px-2 border border-[#E5E7EB] rounded text-sm text-center"
                        />
                        <span className="text-sm text-[#6B7280]">{material.unit}</span>
                        <span className="ml-auto text-sm font-medium text-[#111827]">
                          {material.totalPrice.toLocaleString("nb-NO")} kr
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Material Cost Summary */}
              {selectedMaterials.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-[#6B7280]">Materialer totalt</span>
                    <span className="text-[#111827]">
                      {materialsCost.toLocaleString("nb-NO")} kr
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Labor Cost */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <h3 className="text-lg font-bold text-[#111827] mb-4">Arbeidskostnad</h3>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="number"
                  placeholder="15000"
                  value={laborCost}
                  onChange={(e) => setLaborCost(e.target.value)}
                  className="w-full h-12 pl-10 pr-16 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                  kr
                </span>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-[#F3F4F6] rounded-lg p-6">
              <h4 className="font-semibold text-[#111827] mb-4">Prisoppsummering</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Materialer</span>
                  <span className="font-medium text-[#111827]">
                    {materialsCost.toLocaleString("nb-NO")} kr
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Arbeid</span>
                  <span className="font-medium text-[#111827]">
                    {laborCostNum.toLocaleString("nb-NO")} kr
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">MVA (25%)</span>
                  <span className="font-medium text-[#111827]">
                    {mva.toLocaleString("nb-NO")} kr
                  </span>
                </div>
                <div className="border-t border-[#E5E7EB] pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#111827]">Total</span>
                    <span className="font-bold text-[#17384E] text-lg">
                      {totalPrice.toLocaleString("nb-NO")} kr
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Offer Details */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#111827]">Tilbudsbeskrivelse</h3>
                {isPro || demoProMode ? (
                  <button
                    onClick={() => setShowAIAssistant(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#17384E] to-[#2a5570] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Brain className="w-4 h-4" />
                    AI-assistent
                  </button>
                ) : (
                  <button
                    onClick={() => setDemoProMode(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#17384E] to-[#2a5570] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Brain className="w-4 h-4" />
                    Test AI-assistent
                  </button>
                )}
              </div>

              <textarea
                placeholder="Beskriv hvordan du vil utføre jobben, hva som er inkludert, osv."
                value={offerDescription}
                onChange={(e) => setOfferDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
              />

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    Tidsramme
                  </label>
                  <input
                    type="text"
                    placeholder="f.eks. 2-3 dager"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    Garanti
                  </label>
                  <input
                    type="text"
                    placeholder="f.eks. 2 år garanti"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => alert("Tilbud sendt! (demo)")}
              className="w-full h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Send tilbud
            </button>
          </div>
        </div>
      </div>

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAIAssistant(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#17384E] to-[#2a5570] rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#111827]">AI Tilbudsassistent</h2>
                  <p className="text-sm text-[#6B7280]">Eksklusiv for Pro-kunder</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIAssistant(false)}
                className="text-[#6B7280] hover:text-[#111827]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-[#F3F4F6] rounded-lg p-4 mb-4">
                <div className="text-sm text-[#6B7280] mb-2">AI vil generere en profesjonell beskrivelse basert på:</div>
                <ul className="text-sm text-[#111827] space-y-1">
                  <li>• Jobbdetaljer: {job?.title}</li>
                  <li>• Valgte materialer: {selectedMaterials.length} materialer</li>
                  <li>• Total pris: {totalPrice.toLocaleString("nb-NO")} kr</li>
                </ul>
              </div>

              <button
                onClick={handleGenerateWithAI}
                className="w-full h-12 bg-gradient-to-r from-[#17384E] to-[#2a5570] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generer tilbudsbeskrivelse
              </button>
            </div>

            <div className="text-xs text-[#6B7280]">
              💡 AI-assistenten bruker maskinlæring for å lage profesjonelle tilbudsbeskrivelser som øker sjansen for å vinne jobben.
            </div>
          </div>
        </div>
      )}

      {/* Custom Material Modal */}
      {showCustomMaterialModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCustomMaterialModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#111827]">Legg til egendefinert produkt</h2>
              <button
                onClick={() => setShowCustomMaterialModal(false)}
                className="text-[#6B7280] hover:text-[#111827]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Produktnavn *
                </label>
                <input
                  type="text"
                  value={customMaterialName}
                  onChange={(e) => setCustomMaterialName(e.target.value)}
                  placeholder="f.eks. Spesialtakstein"
                  className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Kategori
                </label>
                <input
                  type="text"
                  value={customMaterialCategory}
                  onChange={(e) => setCustomMaterialCategory(e.target.value)}
                  placeholder="f.eks. Takstein"
                  className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    Enhet *
                  </label>
                  <select
                    value={customMaterialUnit}
                    onChange={(e) => setCustomMaterialUnit(e.target.value)}
                    className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  >
                    <option value="stk">stk</option>
                    <option value="m">m</option>
                    <option value="m²">m²</option>
                    <option value="liter">liter</option>
                    <option value="kg">kg</option>
                    <option value="pk">pk</option>
                    <option value="sett">sett</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    Pris per enhet (kr) *
                  </label>
                  <input
                    type="number"
                    value={customMaterialPrice}
                    onChange={(e) => setCustomMaterialPrice(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCustomMaterialModal(false)}
                  className="flex-1 h-12 border border-gray-300 text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Avbryt
                </button>
                <button
                  onClick={createCustomMaterial}
                  className="flex-1 h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
                >
                  Legg til
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Edit Modal */}
      {showPriceEditModal && editingMaterial && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPriceEditModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#111827]">Tilpass pris og mengde</h2>
              <button
                onClick={() => setShowPriceEditModal(false)}
                className="text-[#6B7280] hover:text-[#111827]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-[#F3F4F6] rounded-lg p-4">
                <div className="font-semibold text-[#111827] mb-1">{editingMaterial.name}</div>
                <div className="text-sm text-[#6B7280]">{editingMaterial.category}</div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Pris per {editingMaterial.unit} (kr)
                </label>
                <input
                  type="number"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                />
                <div className="text-xs text-[#6B7280] mt-1">
                  Foreslått pris: {editingMaterial.pricePerUnit} kr/{editingMaterial.unit}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Mengde ({editingMaterial.unit})
                </label>
                <input
                  type="number"
                  value={editedQuantity}
                  onChange={(e) => setEditedQuantity(e.target.value)}
                  placeholder="1"
                  min="1"
                  step="1"
                  className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                />
              </div>

              <div className="bg-[#E07B3E]/10 border border-[#E07B3E]/20 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#111827] font-medium">Total:</span>
                  <span className="text-[#E07B3E] font-bold text-lg">
                    {((parseFloat(editedPrice) || 0) * (parseFloat(editedQuantity) || 0)).toLocaleString("nb-NO")} kr
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPriceEditModal(false)}
                className="flex-1 h-12 border border-gray-300 text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={confirmAddMaterial}
                className="flex-1 h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
              >
                Bekreft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}