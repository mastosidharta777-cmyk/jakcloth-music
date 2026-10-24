export interface MerchItem {
  id: string
  name: string
  price: string
  badge: string
  image: string
}

export const merchandise: MerchItem[] = [
  {
    id: 'mfr1',
    name: 'For Revenge Official Live Tee',
    price: 'Rp 185.000',
    badge: 'Free Master Audio Access',
    image: '/media/For Revenge tshirt.jpg'
  },
  {
    id: 'mfr2',
    name: 'JakCloth Underground Graphic Hoodie',
    price: 'Rp 350.000',
    badge: 'Free All Compilation Access',
    image: '/media/jakcloth underground tshirt.jpg'
  },
  {
    id: 'mfr3',
    name: 'Sakramen Kebisingan Ekstrim Pin Set',
    price: 'Rp 75.000',
    badge: 'Free Audio Stems',
    image: '/media/sakaramen kebisingan ekstrim pin merchandise.jpg'
  }
]

