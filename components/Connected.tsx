import {
  Button,
  Container,
  Heading,
  VStack,
  Text,
  HStack,
  Image,
} from "@chakra-ui/react"
import {
  FC,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { PublicKey } from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import {
  Metaplex,
  walletAdapterIdentity,
  CandyMachine,
} from "@metaplex-foundation/js"
import { useRouter } from "next/router"

const Connected: FC = () => {
  const { connection } = useConnection()
  const walletAdapter = useWallet()
  const [candyMachine, setCandyMachine] = useState<CandyMachine>()
  const [isMinting, setIsMinting] = useState(false)

  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
  }, [connection, walletAdapter])

  useEffect(() => {
    if (!metaplex) return

    metaplex
      .candyMachines()
      .findByAddress({
        address: new PublicKey("98aHnPgsRnYJUpZkKovSgfwqiUKTmUVJ9WBVwizgHFLJ"),
      })
      .run()
      .then((candyMachine) => {
        console.log(candyMachine)
        setCandyMachine(candyMachine)
      })
      .catch((error) => {
        alert(error)
      })
  }, [metaplex])

  const router = useRouter()

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      if (event.defaultPrevented) return

      if (!walletAdapter.connected || !candyMachine) {
        return
      }

      try {
        setIsMinting(true)
        const nft = await metaplex.candyMachines().mint({ candyMachine }).run()

        console.log(nft)
        router.push(`/newMint?mint=${nft.nft.address.toBase58()}`)
      } catch (error) {
        alert(error)
      } finally {
        setIsMinting(false)
      }
    },
    [metaplex, walletAdapter, candyMachine]
  )

  return (
    <VStack spacing={20}>
      <Container>
        <VStack spacing={8}>
          <Heading
            color="white"
            as="h1"
            size="2xl"
            noOfLines={2}
            textAlign="center"
          >
            Welcome Tartan Gulls.
          </Heading>

          <Text color="bodyText" fontSize="xl" textAlign="center">
            Each Tartan Gull is randomly generated and can be staked to receive
            <Text as="b"> $GULLS</Text>. Use your <Text as="b"> $GULL</Text> to
            upgrade your gulls and receive perks within the community!
          </Text>
        </VStack>
      </Container>

      <HStack spacing={1}>
        <Image src="0.JPG" alt="" />
        <Image src="1.JPG" alt="" />
        <Image src="2.JPG" alt="" />
      </HStack>
      <HStack spacing={1}>
        <Image src="3.JPG" alt=""/>
        <Image src="4.JPG" alt="" />
        <Image src="5.JPG" alt="" />
      </HStack>
      <Button
        bgColor="accent"
        color="white"
        maxW="380px"
        onClick={handleClick}
        isLoading={isMinting}
      >
        <Text>mint Gulls</Text>
      </Button>
    </VStack>
  )
}

export default Connected