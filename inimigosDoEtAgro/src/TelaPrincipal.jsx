import React, { useState } from "react"
import fase1 from "./assets/Fase1.jpeg"
import card1 from "./assets/card1.jpeg"
import iconeLoja from "./assets/icone-loja.png"
import "./telaPrincipal.css"
import { Button, Card, Box, SimpleGrid } from "@chakra-ui/react"

export default function TelaPrincipal() {
  const [abrirGrid, setAbrirGrid] = useState(false)

  return (
    <div>
      <div >
        <img src={fase1} alt="fase1" className="imagem-fase1"/>
      </div>

      <Box position="relative" display="flex" justifyContent="center" mt={3}>
        {abrirGrid && (
          <Box
            position="absolute"
            bottom="100%"
            mb="12px"
            left="50%"
            transform="translateX(-50%)"
            className="cards"
          >
            <SimpleGrid columns={3} spacing={8}>
              {[1].map((i) => (
                <Card.Root width="200px" key={i} cursor="pointer">
                  <img
                    src={card1}
                    alt={`card ${i}`}
                    style={{ width: "100%", display: "block" }}
                  />
                </Card.Root>
              ))}
            </SimpleGrid>
            <SimpleGrid columns={3} spacing={8}>
              {[1].map((i) => (
                <Card.Root width="200px" key={i} cursor="pointer">
                  <img
                    src={card1}
                    alt={`card ${i}`}
                    style={{ width: "100%", display: "block" }}
                  />
                </Card.Root>
              ))}
            </SimpleGrid>
            <SimpleGrid columns={3} spacing={8}>
              {[1].map((i) => (
                <Card.Root width="200px" key={i} cursor="pointer">
                  <img
                    src={card1}
                    alt={`card ${i}`}
                    style={{ width: "100%", display: "block" }}
                  />
                </Card.Root>
              ))}
            </SimpleGrid>
            <SimpleGrid columns={3} spacing={8}>
              {[1].map((i) => (
                <Card.Root width="200px" key={i} cursor="pointer">
                  <img
                    src={card1}
                    alt={`card ${i}`}
                    style={{ width: "100%", display: "block" }}
                  />
                </Card.Root>
              ))}
            </SimpleGrid>
            <SimpleGrid columns={3} spacing={8}>
              {[1].map((i) => (
                <Card.Root width="200px" key={i} cursor="pointer">
                  <img
                    src={card1}
                    alt={`card ${i}`}
                    style={{ width: "100%", display: "block" }}
                  />
                </Card.Root>
              ))}
            </SimpleGrid>
            <SimpleGrid columns={3} spacing={8}>
              {[1].map((i) => (
                <Card.Root width="200px" key={i} cursor="pointer">
                  <img
                    src={card1}
                    alt={`card ${i}`}
                    style={{ width: "100%", display: "block" }}
                  />
                </Card.Root>
              ))}
            </SimpleGrid>

            <Button mt={3} size="sm" onClick={() => setAbrirGrid(false)} className="botao-fechar">
              X
            </Button>
          </Box>
        )}

        <Button
          className="fundo-botao-loja"
          onClick={() => setAbrirGrid((v) => !v)}
        >
          <img src={iconeLoja} alt="Loja" className="icone-loja" />
        </Button>
      </Box>
    </div>
  )
}
