import { Box, Stack ,Skeleton} from '@mui/material'
import React from 'react'

const SkeletonLoader = () => {
  return (
    <Box sx={{ width: "100%" }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={100} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={50} width="30%" />
        </Stack>
      </Box>
  )
}

export default SkeletonLoader