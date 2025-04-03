import Image from "next/image";
import {Grid, GridItem} from "@chakra-ui/react";
import { useTranslations } from "next-intl";

export default function Home() {
  return (
      <main>
          <div className="main-grid-container">
              <Grid
                  h='820px'
                  gap={4}
                  className="m-1 mt-3 main-grid"
              >
                  <GridItem rowSpan={2} colSpan={1} bg='white' className="-z-10">
                      <Image src={"/uploads/philip-veater-qOt9-QPYmSA-unsplash.jpg"} alt={"img 1"} width="400" height="400" />
                      <Image src={"/uploads/ricky-kharawala-adK3Vu70DEQ-unsplash.jpg"} alt={"img 2"} width="400" height="400"
                             style={{marginTop: 10}} />
                  </GridItem>
                  <GridItem colSpan={2} bg='white' className="-z-10">
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                          <Image src={"/uploads/marcus-dietachmair-4JUscQ_9UrA-unsplash.jpg"} alt={"img 3"} width="365" height="800" />
                          <Image src={"/uploads/jae-park-7GX5aICb5i4-unsplash.jpg"} alt={"img 4"} width="365" height="800" />
                      </div>
                  </GridItem>
                  <GridItem rowSpan={2} colSpan={2} bg='white' className="-z-10">
                      <Image src={"/uploads/banner2.jpg"} alt={"img 5"} width="900" height="900" />
                      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, height: 296}}>
                          <Image src={"/uploads/daniel-frank-VL2Vec7fHLU-unsplash.jpg"} alt={"img 5"} width="360" height="550" />
                          <Image src={"/uploads/mikhail-vasilyev-IFxjDdqK_0U-unsplash.jpg"} alt={"img 5"} width="370" height="550" />
                      </div>
                  </GridItem>
                  <GridItem colSpan={2} bg='white' className="-z-10">
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                          <Image src={"/uploads/fatty-corgi-Zn5chZcnFRA-unsplash.jpg"} alt={"img 6"} width="360" height="300" />
                          <Image src={"/uploads/sergey-semin-vMNr5gbeeTk-unsplash.jpg"} alt={"img 6"} width="360" height="300" />
                      </div>
                  </GridItem>
              </Grid>
          </div>
          <div className="main-grid_tb">
              <Grid className="m-10 main-grid_tb_content" gap={6}>
                  <GridItem>
                      <Image src={"/uploads/banner2.jpg"} alt={"img 5"} width="900" height="900" />
                  </GridItem>
                  <GridItem>
                      <Image src={"/uploads/daniel-frank-VL2Vec7fHLU-unsplash.jpg"} alt={"img 5"} width="900" height="900" />
                  </GridItem>
                  <GridItem>
                      <Image src={"/uploads/mikhail-vasilyev-IFxjDdqK_0U-unsplash.jpg"} alt={"img 5"} width="900" height="900" />
                  </GridItem>
                  <GridItem>
                      <Image src={"/uploads/erin-testone-QCyVCPeScnk-unsplash.jpg"} alt={"img 5"} width="900" height="900" />
                  </GridItem>
              </Grid>
          </div>
      </main>
  );
}
