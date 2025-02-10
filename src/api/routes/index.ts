import { Router } from 'express'
import botConfigRoutes from './bot-config.js'
import botManagementRoutes from './bot-management.js'
import utilityRoutes from './utility.js'

const router = Router()

router.use(botConfigRoutes)
router.use(botManagementRoutes)
router.use(utilityRoutes)

export default router
