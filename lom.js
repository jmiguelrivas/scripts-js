import { execSync } from 'child_process'

const gcolor = {
  BLACK: 30,
  RED: 31,
  GREEN: 32,
  YELLOW: 33,
  BLUE: 34,
  MAGENTA: 35,
  CYAN: 36,
  LIGHTGRAY: 37,
  GRAY: 90,
  LIGHTRED: 91,
  LIGHTGREEN: 92,
  LIGHTYELLOW: 93,
  LIGHTBLUE: 94,
  LIGHTMAGENTA: 95,
  LIGHTCYAN: 96,
  WHITE: 97,
}

function renderProgressBar(progress, total) {
  const percent = Math.floor((progress / total) * 100)
  const barLength = 30 // characters
  const filledLength = Math.floor((barLength * percent) / 100)

  const bar = '█'.repeat(filledLength) + '-'.repeat(barLength - filledLength)
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  process.stdout.write(`[${bar}] ${percent}%`)
}

function changeColor(text, color) {
  return `\x1b[0;${color}m${text}\x1b[0m`
}

const h = {
  separator: (len = 30, char = '-') => char.repeat(len),

  print: (message, color = gcolor.WHITE) =>
    console.log(changeColor(message, color)),

  title: (title, color = gcolor.YELLOW, len) => {
    const separator = h.separator(len)
    h.print(`${separator} ${title}`, color)
  },

  sectionTitle: (title, len = 30) => {
    const separator = h.separator(len)
    h.print(`${separator} ${title} ${separator}`, gcolor.GRAY)
  },

  stop: app => {
    h.print(`cerrar ${app}`, gcolor.LIGHTRED)
    execSync(`adb shell am force-stop ${app}`)
  },

  screenshot: (localPath, filename) => {
    h.print(`tomar captura de pantalla`, gcolor.LIGHTMAGENTA)
    const remotePath = `/sdcard/${filename}.png`
    const fullLocalPath = `${localPath}/${filename}.png`
    execSync(`adb shell screencap -p ${remotePath}`)
    execSync(`adb pull ${remotePath} ${fullLocalPath}`)
    execSync(`adb shell rm ${remotePath}`)
  },

  repeat: (fn, times, message) => {
    if (message) {
      h.print(message, gcolor.WHITE)
    }
    for (let i = 0; i < times; i++) {
      renderProgressBar(i + 1, times)
      fn(i)
    }
    console.log('\nacabado')
  },

  tap: (x, y, message, wait = 1) => {
    if (message) {
      h.print(message, gcolor.WHITE)
    }
    execSync(`adb shell input tap ${x} ${y}`)
    if (wait) {
      h.wait(wait)
    }
  },

  swipe: (xStart, yStart, xFinal, yFinal, duration, message, wait) => {
    if (message) {
      h.print(message, gcolor.LIGHTGREEN)
    }
    execSync(
      `adb shell input swipe ${xStart} ${yStart} ${xFinal} ${yFinal} ${duration}`
    )
    if (wait) {
      h.wait(wait)
    }
  },

  wait: (seconds = 1, message) => {
    if (message) {
      h.print(message, gcolor.LIGHTMAGENTA)
    }
    const ms = seconds * 1000
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
  },
}

const homeSection = {
  init() {
    h.sectionTitle('Home')
    homeSection.menuBar()
    homeSection.soul()
  },
  soul() {
    h.title('Alma Marcial')
    h.tap(910, 1500, 'abrir seccion de alma marcial', 1)
    h.tap(880, 1950, 'navegar a la seccion de obtencion de alma marcial', 1)
    h.tap(520, 860, 'abrir provocacion de alma marcial', 1)
    h.tap(900, 470, 'tomar recompensas diarias', 2.5)
    h.tap(900, 470, 'cerrar notificacion', 1)
    h.tap(890, 2150, 'salir de la seccion de provocacion de alma marcial', 1)
    h.tap(520, 2100, 'salir de la seccion de alma marcial', 1)
  },
  menuBar() {
    h.title('Menu')
    h.tap(80, 172, 'abrir menu principal', 1)
    homeSection.mail()
    homeSection.friends()
    homeSection.share()
  },
  mail() {
    h.title('Correo')
    h.tap(80, 765, 'abrir correo', 1)
    h.tap(711, 1640, 'recibir correo', 2.5)
    h.tap(711, 1640, 'cerrar la notificacion', 1)
    h.tap(520, 1810, 'salir del correo', 1)
  },
  friends() {
    h.title('Amigos')
    h.tap(80, 1070, 'entrar a la seccion de amigos', 2.5)
    h.tap(520, 1540, 'dar y recibir monedas de oro', 2.5)
    h.tap(520, 1540, 'cerrar notificacion', 1)
    h.tap(520, 1760, 'salir de la seccion de amigos', 1)
  },
  share() {
    h.title('Compartir')
    h.tap(80, 1400, 'abrir seccion de compartir', 0.5)
    h.tap(340, 1480, 'compartir con discord', 0.5)
    h.stop('com.brave.browser')
    h.stop('com.discord')
    h.wait(0.5)
    h.tap(300, 1350, 'recibir gemas de discord', 2.5)
    h.tap(300, 1350, 'cerrar notificacion de compra')
    h.tap(520, 2140, 'cerrar modal', 1)
  },
}

const fightSection = {
  init() {
    h.sectionTitle('Lucha')
    h.tap(430, 2180, 'abrir seccion de lucha', 1)
    h.swipe(
      520,
      800,
      520,
      2200,
      100,
      'navegar hacia arriba del menu de lucha',
      1
    )
    fightSection.lampDungeon()
    fightSection.diamondDungeon()
    h.swipe(
      520,
      1930,
      520,
      1000,
      2000,
      'navegar a la seccion de ciudad antigua',
      1
    )
    fightSection.relicDungeon()
    fightSection.chronoDungeon()
    fightSection.runestonesDungeon()
    h.tap(430, 2180, 'cerrar seccion de lucha', 1)
  },
  lampDungeon() {
    h.title('Ladron de Lampara Magica')
    h.tap(830, 1430, 'abrir menu de ladron de la lampara magica', 1)
    h.repeat(
      () => {
        h.tap(450, 1570, null, null)
      },
      80,
      'hacer raide'
    )
    h.tap(520, 1900, 'cerrar modal', 1)
  },
  diamondDungeon() {
    h.title('Ruinas de las LLamas')
    h.tap(830, 1750, 'abrir menu de ruinas de las llamas', 1)
    h.repeat(
      () => {
        h.tap(450, 1570, null, null)
      },
      80,
      'hacer raide'
    )
    h.tap(520, 1900, 'cerrar modal', 1)
  },
  relicDungeon() {
    h.title('Ciudad Antigua')
    h.tap(830, 940, 'abrir menu de ciudad antigua', 2.5)
    h.repeat(
      () => {
        h.tap(330, 1920, null, null)
      },
      80,
      'hacer raide'
    )
    h.tap(520, 2079, 'cerrar modal', 1)
    h.tap(711, 1260, 'confirmar cerrar modal', 1)
  },
  chronoDungeon() {
    h.title('Torre Cronologica')
    h.tap(830, 1250, 'abrir menu de torre cronologica', 1)
    h.repeat(
      () => {
        h.tap(450, 1570, null, null)
      },
      80,
      'hacer raide'
    )
    h.tap(520, 1900, 'cerrar modal', 1)
  },
  runestonesDungeon() {
    h.title('Santuario de las LLamas')
    h.tap(830, 1560, 'abrir menu de santuario de llama ardiente', 1)
    h.repeat(
      () => {
        h.tap(410, 1600, null, null)
      },
      80,
      'hacer raide'
    )
    h.tap(520, 1900, 'cerrar modal', 1)
  },
}

const islandSection = {
  init() {
    h.sectionTitle('Isla')
    h.tap(610, 2180, 'ir a la isla', 1)
    // islandSection.farm()
    islandSection.parking()
    islandSection.clerk()
    h.tap(610, 2180, 'salir de la isla', 1)
  },
  // farm() {
  //   h.title('Hacienda')
  //   h.tap(400, 1590, 'abrir hacienda', 1)
  //   h.tap(700, 2180, 'abrir tienda', 1)
  //   h.tap(700, 1250, 'abrir modal de compra de abono', 1)
  //   h.tap(730, 1100, 'seleccionar 5', 1)
  //   h.tap(520, 1290, 'comprar', 2.5)
  //   h.tap(900, 630, 'cerrar notificacion de compra', 1)
  //   h.tap(900, 2180, 'salir de la hacienda', 1)
  // },
  parking() {
    h.title('Estacionamiento')
    h.tap(800, 1200, 'abrir estacionamiento', 1)
    h.tap(700, 2180, 'abrir tienda', 1)
    h.tap(220, 1100, 'abrir modal de compra de guia', 1)
    h.tap(730, 1100, 'seleccionar 5', 1)
    h.tap(520, 1290, 'comprar', 2.5)
    h.tap(900, 630, 'cerrar notificacion de compra', 1)
    h.tap(900, 2180, 'salir del estacionamiento', 1)
  },
  clerk() {
    h.title('Oficiante')
    h.tap(590, 750, 'abrir seccion de oficiante', 2)
    h.tap(350, 320, 'abrir modal de conseguir lates', 2)
    h.tap(750, 1080, 'aumentar la cantidad de lates', 1)
    h.tap(520, 1250, 'comprar lates', 2)
    h.tap(520, 430, 'cerrar notificacion de compra', 2)
    h.tap(830, 750, 'abrir modal de dar lates a la primera persona', 1)
    h.tap(520, 1470, 'dar lates', 1)
    h.tap(520, 1840, 'salir de ver intimidad', 1)
  },
}

const clanSection = {
  init() {
    h.sectionTitle('Clan')
    h.tap(800, 2180, 'ir a la isla del clan', 1)
    h.swipe(520, 150, 520, 2000, 7000, 'caminar hasta abajo')
    clanSection.hall()
    h.tap(800, 2180, 'salir de la isla del clan', 2.5)
  },
  hall() {
    h.title('Salon del Clan')
    h.tap(380, 350, 'abrir el modal del salon', 1)
    h.tap(630, 1900, 'abrir modal de donaciones', 1)
    h.repeat(
      () => {
        h.tap(520, 1270, null, null)
      },
      15,
      'donar al clan'
    )
    h.wait(2)
    h.tap(520, 1270, 'cerrar notificacion', 2)
    h.tap(420, 1910, 'navegar a la seccion de ayuda de clan', 1)
    h.tap(520, 1890, 'ayudar a todos', 2)
    h.tap(520, 1890, 'cerrar notificacion', 1)
    h.tap(520, 2000, 'salir de la seccion de ayuda', 1.5)
    h.tap(520, 2000, 'salir del salon', 2)
  },
}

const shopSection = {
  init() {
    h.sectionTitle('Tienda')
    h.tap(940, 2180, 'ir a la tienda', 1)
    h.tap(170, 2010, 'navegar a la seccion de roleta de habilidades', 2.5)
    shopSection.getItems()
    h.tap(660, 450, 'navegar a la seccion de roleta de companeros', 1)
    shopSection.getItems()
    h.tap(940, 2180, 'salir de la tienda', 1)
  },
  getItems() {
    h.repeat(
      () => {
        h.tap(300, 1450, null, null)
      },
      3,
      'rodar maquina por 35'
    )
    h.wait(2)
    h.tap(520, 1900, 'cerrar notificacion', 1)
  },
}

function changeUser() {
  h.sectionTitle('Cambiar de Usuario')
  h.tap(80, 150, 'abrir menu principal', 1)
  h.tap(180, 500, 'abrir perfil del jugador', 1)
  h.tap(730, 1380, 'abrir cambiar de cuenta', 1)
  h.tap(760, 1070, 'click en la lista de cuentas', 1)
  h.tap(520, 1385, 'seleccionar la ultima', 1)
  h.tap(520, 1200, 'aceptar', null)
  // h.swipe(520, 10, 520, 2100, 7000, "navegar hacia abajo en la lista de usuarios")
}

function init() {
  console.clear()

  const profiles = ['doruk', 'bruno', 'eko']
  profiles.forEach((profile, index) => {
    h.sectionTitle(profile)
    if (index === 0) {
      h.stop('com.whatsapp')
    } else {
      h.wait(15)
    }
    h.tap(660, 1590, 'recibir recompensa')
    h.tap(660, 1590, 'cerrar notificacion', 2)
    h.tap(660, 1590, null, 1)
    h.repeat(
      () => {
        h.tap(520, 20, null, 1)
      },
      5,
      'asegurar que las notificaciones y modales cierren'
    )
    const now = new Date()
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/T/g, '_')
      .split('.')[0]
    const filename = `${profile}_${timestamp}`
    h.screenshot(`/home/beemo/Imagens/lom/${profile}`, filename)

    homeSection.init()
    fightSection.init()
    islandSection.init()
    clanSection.init()
    shopSection.init()

    changeUser()
  })
}

// Object.values(gcolor).forEach(c => {
//   console.log(h.changeColor(c, c))
// })

init()
