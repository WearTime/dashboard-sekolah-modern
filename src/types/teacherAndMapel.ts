import { Mapel } from "./mapel";
import { Guru } from "./teacher";

export interface GuruAndMapel {
  id: string;
  kode_mapel: string;
  nip_guru: string;
  mapel?: Mapel;
  guru?: Guru;
}
