import React, { useState } from "react"
import fase1 from "./assets/Fase1.jpeg"
import card1 from "./assets/card1.jpeg"
import card2 from "./assets/card2.jpeg"
import card3 from "./assets/card3.jpeg"
import iconeManual from "./assets/icone-manual.png"
import iconeLoja from "./assets/icone-loja.png"
import { Mark, Stack, Text } from "@chakra-ui/react"
import { Button, Card, Box, SimpleGrid } from "@chakra-ui/react"
import "./telaPrincipal.css"

export default function TelaPrincipal() {
    const [abrirGrid, setAbrirGrid] = useState(false)
    const [abrirManual, setAbrirManual] = useState(false)

    return (
        <div>
            <div>
                <img src={fase1} alt="fase1" className="imagem-fase1" />
            </div>

            <Box position="relative" display="flex" justifyContent="center" mt={55}>
                {abrirGrid && (
                    <Box
                        position="absolute"
                        bottom="10%"
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
                                        src={card2}
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
                                        src={card3}
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
                                        src={card3}
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
                                        src={card3}
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
                                        src={card3}
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

                {abrirManual && (
                    <Box
                        position="absolute"
                        bottom="100%"
                        mb="12px"
                        left="50%"
                        transform="translateX(-50%)"
                        className="manual"
                        zIndex={0}
                    >
                        <Stack gap="6" p="4">
                            {["solid"].map((variant) => (
                                <Text key={variant}>
                                    A <Mark variant={variant}>Precipitação</Mark> Precipitação é a água que cai do céu na forma de chuva, granizo ou neve.
                                    Na agricultura, ela é importante porque molha a terra e ajuda as plantas a crescerem.
                                    Se chove pouco, a planta pode ficar com sede. Se chove demais, o solo pode encharcar e prejudicar a lavoura.
                                </Text>
                            ))}
                        </Stack>

                        <Button mt={3} size="sm" onClick={() => setAbrirManual(false)} className="botao-fechar">
                            X
                        </Button>
                    </Box>
                )}

                <Button
                    className="fundo-botao-manual"
                    onClick={() => setAbrirManual((v) => !v)}
                >
                    <img src={iconeManual} alt="manual" className="icone-manual" />
                </Button>
            </Box>
        </div>
    )
}
