export type DataPoint = [number, number]

export type NavItem = {
   title: string
   href: string
   disabled?: boolean
}

export type MainNavItem = NavItem

export type SiteConfig = {
   name: string
   description?: string
   url?: string
   ogImage?: string
   mainNav?: MainNavItem[]
}