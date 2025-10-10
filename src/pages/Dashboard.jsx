import React from 'react'
import BarChart from '../commen-component/BarChart/BarChart'
import MovingBulletsChart from '../commen-component/BarChart/BarChart'
import ColumnsWithMovingBullets from '../commen-component/BarChart/BarChart'
import { Box, Grid, Typography } from '@mui/material'
import BarChartLead from '../commen-component/BarChart/BarChartlead'
import BarChartRegister from '../commen-component/BarChart/BarChartRegister'

const Dashboard = () => {
  return (
    <>
      <Box borderBottom={1} borderColor={"#ddd"} paddingBottom={4}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid size={{ xs: 2, sm: 4, md: 4 }}>
            <Box sx={{ background: "linear-gradient(135deg, #75d9e6ff, #c843ff, #ff7eff)", height: "200px", width: "100%", borderRadius: "12px", padding: "30px" }}>
              <Typography style={{ color: "#fff", fontWeight: "bold", fontSize: "30px" }}>Total Reveneu</Typography>
              <Typography style={{ color: "#fff", fontWeight: "bold", fontSize: "60px" }}>₹ 1000</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 2, sm: 4, md: 4 }}>
            <Box sx={{ background: "linear-gradient(135deg, #75d9e6ff, #c843ff, #ff7eff)", height: "200px", width: "100%", borderRadius: "12px", padding: "30px" }}>
              <Typography style={{ color: "#fff", fontWeight: "bold", fontSize: "30px" }}>Total User Registered</Typography>
              <Typography style={{ color: "#fff", fontWeight: "bold", fontSize: "60px" }}>₹ 1000</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 2, sm: 4, md: 4 }}>
            <Box sx={{ background: "linear-gradient(135deg, #75d9e6ff, #c843ff, #ff7eff)", height: "200px", width: "100%", borderRadius: "12px", padding: "30px" }}>
              <Typography style={{ color: "#fff", fontWeight: "bold", fontSize: "30px" }}>Total Lead</Typography>
              <Typography style={{ color: "#fff", fontWeight: "bold", fontSize: "60px" }}>₹ 1000</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid size={{ xs: 2, sm: 4, md: 4 }}>
          <Box>
            <Typography style={{ fontWeight: "bold", fontSize: "20px", margin: 10 }}>Revenue panel wise</Typography>
            <ColumnsWithMovingBullets />
          </Box>
        </Grid>
        <Grid size={{ xs: 2, sm: 4, md: 4 }}>
          <Box>
            <Typography style={{ fontWeight: "bold", fontSize: "20px", margin: 10 }}>User Registered panel wise</Typography>
            <BarChartRegister />
          </Box>
        </Grid>
        <Grid size={{ xs: 2, sm: 4, md: 4 }}>
          <Box>
            <Typography style={{ fontWeight: "bold", fontSize: "20px", margin: 10 }}>Lead panel wise</Typography>
            <BarChartLead />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard 