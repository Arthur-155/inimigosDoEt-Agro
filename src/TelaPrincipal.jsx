import React, { useState, useEffect } from "react";
import fase1 from "./assets/Fase1.jpeg";
import card2 from "./assets/card2.jpeg";
import card3 from "./assets/card3.jpeg";
import card4 from "./assets/card4.jpeg";
import card5 from "./assets/card5.jpeg";
import card6 from "./assets/card6.jpeg";
import milhoFase1 from "./assets/milho-estagio-1.jpeg";
import milhoFase2 from "./assets/milho-estagio-2.jpeg";
import milhoFase3 from "./assets/milho-estagio-3.jpeg";
import faseChuva from "./assets/fase-chuva.jpeg";
import iconeSeta from "./assets/icone-seta.png";
import iconeManual from "./assets/icone-manual.png";
import iconeLoja from "./assets/icone-loja.png";
import { Mark, Stack, Text, Button, Box, SimpleGrid, Badge } from "@chakra-ui/react";
import "./telaPrincipal.css";

// séries base (15 dias)
const NDVI = [0.62,0.60,0.59,0.57,0.58,0.61,0.63,0.64,0.62,0.60,0.58,0.56,0.55,0.57,0.59];
const SOIL = [0.30,0.31,0.29,0.28,0.27,0.29,0.32,0.33,0.31,0.30,0.28,0.27,0.29,0.30,0.31];
const LSTC = [32,31,33,34,32,31,30,29,31,32,33,34,32,31,30];

// economia mais dura
const ECON = {
  startMoney: 30,
  dayIncome: 2,
  plantCost: 15,
  harvestBase: 40,
  irrigCost: 6,
  fertCost: 10,
  upkeepPerDayPlanted: 2,
  shop: { card6: 25, card2: 10, card3: 14, card4: 12, card5: 18 },
};

export default function TelaPrincipal() {
  const [abrirGrid, setAbrirGrid] = useState(false);
  const [abrirManual, setAbrirManual] = useState(false);

  const [dia, setDia] = useState(1); // 1..15
  const [rain, setRain] = useState(false); // chuva do dia
  const [irrigBoost, setIrrigBoost] = useState(0); // +solo do dia
  const [fertLeft, setFertLeft] = useState(0); // dias restantes de bônus NDVI
  const [everFertilized, setEverFertilized] = useState(false); // já adubou no ciclo?

  // cultivo
  const [faseMilho, setFaseMilho] = useState(0);
  const [planted, setPlanted] = useState(false);
  const [ultimoDiaAtualizado, setUltimoDiaAtualizado] = useState(0);
  const [plantDay, setPlantDay] = useState(0); // dia do plantio
  const [health, setHealth] = useState(0); // 0..100

  const [money, setMoney] = useState(ECON.startMoney);

  const [warnings, setWarnings] = useState([]); // string[]

  // base do dia
  const ndviBase = NDVI[dia - 1] ?? NDVI[NDVI.length - 1];
  const soilBase = SOIL[dia - 1] ?? SOIL[SOIL.length - 1];
  const lst = LSTC[dia - 1] ?? LSTC[LSTC.length - 1];

  // modificadores
  const ndviShown = Math.min(0.9, ndviBase + (fertLeft > 0 ? 0.05 : 0));
  const soilShown = Math.min(0.60, soilBase + (rain ? 0.05 : 0) + irrigBoost);

  // chuva inicial no dia 1
  useEffect(() => { setRain(Math.random() < 0.35); }, []);

  // passar dia
  const avancarDia = () => {
    if (dia >= 15) return;

    // renda básica menos manutenção se plantado
    setMoney((m) => m + ECON.dayIncome - (planted ? ECON.upkeepPerDayPlanted : 0));

    // clima do próximo dia (~35% de chance)
    const willRain = Math.random() < 0.35;
    setRain(willRain);

    // decai fertilizante
    setFertLeft((d) => (d > 0 ? d - 1 : 0));

    // bônus de irrigação dura 1 dia
    setIrrigBoost(0);

    // avança calendário
    setDia((d) => d + 1);
  };

  const resetar = () => {
    setDia(1);
    setRain(false);
    setIrrigBoost(0);
    setFertLeft(0);
    setEverFertilized(false);
    setPlanted(false);
    setFaseMilho(0);
    setUltimoDiaAtualizado(0);
    setPlantDay(0);
    setHealth(0);
    setWarnings([]);
    // dinheiro mantém; para resetar: setMoney(ECON.startMoney);
  };

  const plantar = () => {
    if (planted) return;
    if (money < ECON.plantCost) { alert("Saldo insuficiente para plantar."); return; }
    setMoney((m) => m - ECON.plantCost);
    setPlanted(true);
    setFaseMilho(1);
    setUltimoDiaAtualizado(dia);
    setPlantDay(dia);
    setHealth(60); // começa mediano
    setEverFertilized(false);
  };

  const colher = () => {
    if (!planted) return;
    if (faseMilho < 3) { alert("Colha apenas na fase 3."); return; }

    let bonusPenalty = 0;
    if (!everFertilized && plantDay > 0 && dia - plantDay > 2) {
      bonusPenalty -= 10; // penalidade por não adubar até D+2
    }
    const base = ECON.harvestBase + bonusPenalty;
    const reward = health > 30 ? Math.max(5, Math.round(base * Math.max(0, health) / 100)) : 10;

    setMoney((m) => m + reward);
    setPlanted(false);
    setFaseMilho(0);
    setHealth(0);
    setWarnings([]);
  };

  // consequências e avisos do dia
  useEffect(() => {
    const w = [];

    if (planted) {
      let delta = 0;

      if (soilShown < 0.28) {
        delta -= 10;
        w.push("Solo baixo (<0.28). Irrigue para evitar murcha.");
      }

      if (lst >= 33 && soilShown < 0.30) {
        delta -= 5;
        w.push("Calor e solo seco. Perda extra de saúde.");
      }

      const lateFert = (!everFertilized && plantDay > 0 && dia - plantDay > 2);
      if (lateFert) {
        w.push("Sem adubação até D+2. Crescimento mais lento e colheita menor.");
      }

      if (rain && soilShown >= 0.30) delta += 2;
      if (fertLeft > 0) delta += 2;

      setHealth((h) => {
        const nh = Math.max(0, Math.min(100, h + delta));
        if (nh <= 0) {
          w.push("A lavoura morreu. Replante.");
          // mata a lavoura
          setPlanted(false);
          setFaseMilho(0);
        }
        return nh;
      });
    }

    setWarnings(w);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dia, soilShown, lst, rain, planted, everFertilized, fertLeft]);

  // evolução das fases
  useEffect(() => {
    if (!planted) return;
    if (dia === ultimoDiaAtualizado) return;

    const lateFert = (!everFertilized && plantDay > 0 && dia - plantDay > 2);
    const needsExtraDay = lateFert;
    const canAdvance = !needsExtraDay || ((dia - plantDay) % 2 === 0);

    if (canAdvance && faseMilho < 3) {
      setFaseMilho((f) => Math.min(3, f + 1));
    }
    setUltimoDiaAtualizado(dia);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dia, planted, faseMilho]);

  // ações extra
  const irrigar = () => {
    if (!planted) { alert("Plante antes de irrigar."); return; }
    if (money < ECON.irrigCost) { alert("Saldo insuficiente para irrigar."); return; }
    setMoney((m) => m - ECON.irrigCost);
    setIrrigBoost((v) => Math.min(0.10, v + 0.05));
  };

  const adubar = () => {
    if (!planted) { alert("Plante antes de adubar."); return; }
    if (money < ECON.fertCost) { alert("Saldo insuficiente para adubar."); return; }
    setMoney((m) => m - ECON.fertCost);
    setFertLeft((d) => d + 3);
    setEverFertilized(true);
  };

  // loja
  const comprar = (key) => {
    const price = ECON.shop[key];
    if (price == null) return;
    if (money < price) { alert("Saldo insuficiente."); return; }
    setMoney((m) => m - price);
  };

  // imagens
  const campoSrc = rain ? faseChuva : fase1;
  const milhoSrc =
    faseMilho === 1 ? milhoFase1 :
    faseMilho === 2 ? milhoFase2 :
    faseMilho === 3 ? milhoFase3 : null;

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        <h1 className="contador-dias">DIA {dia}</h1>
        <div style={{ fontWeight:"bold", fontSize:18 }}>💰 R$ {money}</div>
        {planted && <Badge colorScheme={health > 60 ? "green" : health > 30 ? "yellow" : "red"}>Saúde {health}</Badge>}
        {fertLeft > 0 && <div style={{ fontSize:14, color:"#2a7" }}>Bônus NDVI: {fertLeft}d</div>}
      </div>


        
      <p className="icone-seta" onClick={avancarDia}
        style={{ cursor: dia < 15 ? "pointer" : "not-allowed", opacity: dia < 15 ? 1 : 0.5 }}
      ><b>➡️</b></p>

      <Button size="sm" onClick={resetar} ml={3} mt={2}>Resetar</Button>

      <div style={{ marginTop: 8 }}>
        <p>Qualidade da plantação (NVDI): <b>{ndviShown.toFixed(2)}</b> {ndviShown >= 0.5 ? "(Bom)" : "(Baixo)"}</p>
        <p>Umidade do solo (Soil): <b>{soilShown.toFixed(2)} m³/m³</b> {(soilShown >= 0.25 && soilShown <= 0.60) ? "(Ok)" : "(Atenção)"}</p>
        <p>Temperatura (LST): <b>{lst}°C</b></p>
        <p><b>Clima:</b> {rain ? "Chuva" : "Seco"} {irrigBoost > 0 ? " | Irrigado" : ""}</p>
        <p><b>Plantação:</b> {planted ? `Fase ${faseMilho}` : "Não plantado"}</p>

        {warnings.length > 0 && (
          <ul style={{ marginTop: 6, color: "#b00" }}>
            {warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        )}
      </div>

      <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
        <Button size="sm" onClick={plantar} isDisabled={planted}>Plantar (R$ {ECON.plantCost})</Button>
        <Button size="sm" onClick={colher} isDisabled={!planted || faseMilho < 3}>Colher (~R$ {Math.max(10, Math.round(ECON.harvestBase * Math.max(0, health)/100))})</Button>
        <Button size="sm" onClick={irrigar} isDisabled={!planted}>Irrigar (R$ {ECON.irrigCost})</Button>
        <Button size="sm" onClick={adubar} isDisabled={!planted}>Adubar (R$ {ECON.fertCost})</Button>
      </div>

      <div style={{ position: "relative", display: "inline-block", marginTop: 8 }}>
        <img src={campoSrc} alt="campo" className="imagem-fase1" />
        {milhoSrc && !rain && planted && (
          <img
            src={milhoSrc}
            alt={`milho-fase-${faseMilho}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "550px",
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      <Box position="relative" display="flex" justifyContent="center" mt={10}>
        {abrirGrid && (
          <Box position="absolute" bottom="110%" left="50%" transform="translateX(-50%)" className="cards">
            <SimpleGrid columns={3} spacing={8}>
              <Box width="150px" cursor="pointer" onClick={() => comprar("card6")}>
                <img src={card6} alt="card6" style={{ width: "100%", display: "block" }} />
                <Box p={1} textAlign="center">R$ {ECON.shop.card6}</Box>
              </Box>
            </SimpleGrid>
            <SimpleGrid columns={2} spacing={8}>
              <Box width="150px" cursor="pointer" onClick={() => comprar("card5")}>
                <img src={card3} alt="card5" style={{ width: "100%", display: "block" }} />
                <Box p={1} textAlign="center">R$ {ECON.shop.card5}</Box>
              </Box>
            </SimpleGrid>
            <SimpleGrid columns={2} spacing={8}>
              <Box width="150px" cursor="pointer" onClick={() => comprar("card5")}>
                <img src={card2} alt="card5" style={{ width: "100%", display: "block" }} />
                <Box p={1} textAlign="center">R$ {ECON.shop.card5}</Box>
              </Box>
            </SimpleGrid>
            <Button mt={3} size="sm" onClick={() => setAbrirGrid(false)} className="botao-fechar">X</Button>
          </Box>
        )}

        <Button className="fundo-botao-loja" onClick={() => setAbrirGrid((v) => !v)}>
          <img src={iconeLoja} alt="Loja" className="icone-loja" />
        </Button>

        {abrirManual && (
          <Box position="absolute" bottom="100%" mb="12px" left="50%" transform="translateX(-50%)" className="manual" zIndex={0}>
            <Stack gap="6" p="4">
              <Text>
                A <Mark variant="solid">Precipitação</Mark> é a água que cai do céu. Pouca chuva pode causar estresse hídrico. Muita chuva pode encharcar e prejudicar a lavoura.
              </Text>
            </Stack>
            <Button mt={3} size="sm" onClick={() => setAbrirManual(false)} className="botao-fechar">X</Button>
          </Box>
        )}

        <Button className="fundo-botao-manual" onClick={() => setAbrirManual((v) => !v)}>
          <img src={iconeManual} alt="manual" className="icone-manual" />
        </Button>
      </Box>
    </div>
  );
}
