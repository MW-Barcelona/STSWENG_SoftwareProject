import {
  bSourceHasBlack,
  bSourceHasWhite,
  bBlackExistsAdj,
  bWhiteExistsAdj,
  bPieceExistsAfterAdj,
  bNoBlackJumps,
  bNoWhiteJumps
} from '../../services/moveCaptureService'

import { bIsValidCapture } from '../../services/kingCaptureService'

const mutations = {
  mHighlight: (state, coords) => {
    // TODO: Highlight legal moves
    state.firstClick = coords
  },

  mMoveForward: (state, coords) => {
    console.log('Mutate ' + coords.nRow + ', ' + coords.nCol)
    if (coords.nDestCol >= 1 && coords.nDestCol <= 8 && coords.nDestRow >= 1 && coords.nDestRow <= 8) {
      const newCurr = {
        nRow: coords.nRow,
        nCol: coords.nCol,
        bHasBlackChip: false,
        bHasWhiteChip: false,
        bHasBlackKing: false,
        bHasWhiteKing: false
      }
      const newDest = {
        nRow: coords.nDestRow,
        nCol: coords.nDestCol,
        bHasBlackChip: false,
        bHasWhiteChip: false,
        bHasBlackKing: false,
        bHasWhiteKing: false
      }

      let bIsValid = false

      // Check for adjacent squares
      const srcCell = state.cells[coords.nRow - 1][coords.nCol - 1]
      const destCell = state.cells[coords.nDestRow - 1][coords.nDestCol - 1]

      const bIsSquareOpen = !(destCell.bHasBlackChip || destCell.bHasWhiteChip)
      const bIsColLeftOrRight = coords.nCol - 1 === coords.nDestCol || coords.nCol + 1 === coords.nDestCol

      const _bSourceHasBlack = srcCell.bHasBlackChip
      const bNextRowBelow = coords.nRow - 1 === coords.nDestRow
      const bLastRowBelow = coords.nDestRow === 1
      const _bSourceHasWhite = srcCell.bHasWhiteChip
      const bNextRowAbove = coords.nRow + 1 === coords.nDestRow
      const bLastRowAbove = coords.nDestRow === 8

      if (bIsSquareOpen && bIsColLeftOrRight && _bSourceHasBlack && bNextRowBelow && bLastRowBelow) {
        bIsValid = true
        newDest.bHasBlackChip = true
        newDest.bHasBlackKing = true
      } else if (bIsSquareOpen && bIsColLeftOrRight && _bSourceHasWhite && bNextRowAbove && bLastRowAbove) {
        bIsValid = true
        newDest.bHasWhiteChip = true
        newDest.bHasWhiteKing = true
      } else if (bIsSquareOpen && bIsColLeftOrRight && _bSourceHasBlack && bNextRowBelow) {
        bIsValid = true
        newDest.bHasBlackChip = true
      } else if (bIsSquareOpen && bIsColLeftOrRight && _bSourceHasWhite && bNextRowAbove) {
        bIsValid = true
        newDest.bHasWhiteChip = true
      }

      // Check if the move is valid
      if (bIsValid) {
        // Perform a deep copy of the board with the new positions of chips
        const stateClone = JSON.parse(JSON.stringify(state.cells))

        stateClone[newCurr.nRow - 1][newCurr.nCol - 1] = newCurr
        stateClone[newDest.nRow - 1][newDest.nCol - 1] = newDest

        state.cells = stateClone
        state.firstClick = null
      } else {
        const bDestHasWhite = state.cells[coords.nDestRow - 1][coords.nDestCol - 1].bHasWhiteChip
        const bDestHasBlack = state.cells[coords.nDestRow - 1][coords.nDestCol - 1].bHasBlackChip
        const bSrcDestBlack = bSourceHasBlack(state.cells, coords) && bDestHasBlack
        const bSrcDestWhite = bSourceHasWhite(state.cells, coords) && bDestHasWhite

        const bSrcHasWhiteKing = state.cells[coords.nRow - 1][coords.nCol - 1].bHasWhiteKing
        const bSrcHasBlackKing = state.cells[coords.nRow - 1][coords.nCol - 1].bHasBlackKing
        const bDestHasWhiteKing = state.cells[coords.nDestRow - 1][coords.nDestCol - 1].bHasWhiteKing
        const bDestHasBlackKing = state.cells[coords.nDestRow - 1][coords.nDestCol - 1].bHasBlackKing

        let newCoords

        // If both the source and destination pieces have the same color -
        // this happens when clicking on a piece followed by clicking another
        // same-colored piece adjacent to it
        if (bSrcDestBlack || bSrcDestWhite) {
          newCoords = {
            nRow: coords.nDestRow,
            nCol: coords.nDestCol,
            bHasWhiteChip: bDestHasWhite,
            bHasBlackChip: bDestHasBlack,
            bHasWhiteKing: bDestHasWhiteKing,
            bHasBlackKing: bDestHasBlackKing
          }
        } else { // Otherwise, simply set it to the current coordinates
          newCoords = { nRow: coords.nRow, nCol: coords.nCol, bHasBlackKing: bSrcHasBlackKing, bHasWhiteKing: bSrcHasWhiteKing }
        }

        mutations.mHighlight(state.cells, newCoords)
        state.firstClick = newCoords
      }
    }
  },

  mKingMovement: (state, coords) => {
    console.log('Mutate ' + coords.nRow + ', ' + coords.nCol)
    if (coords.nDestCol >= 1 && coords.nDestCol <= 8 && coords.nDestRow >= 1 && coords.nDestRow <= 8) {
      const newCurr = {
        nRow: coords.nRow,
        nCol: coords.nCol,
        bHasBlackChip: false,
        bHasWhiteChip: false,
        bHasBlackKing: false,
        bHasWhiteKing: false
      }
      const newDest = {
        nRow: coords.nDestRow,
        nCol: coords.nDestCol,
        bHasBlackChip: false,
        bHasWhiteChip: false,
        bHasBlackKing: false,
        bHasWhiteKing: false
      }

      let bIsValid = false

      // Check for adjacent squares
      const srcCell = state.cells[coords.nRow - 1][coords.nCol - 1]
      const destCell = state.cells[coords.nDestRow - 1][coords.nDestCol - 1]

      const bIsSquareOpen = !(destCell.bHasBlackChip || destCell.bHasWhiteChip)

      const _bSourceHasBlack = srcCell.bHasBlackChip
      const _bSourceHasBlackKing = srcCell.bHasBlackKing
      const _bSourceHasWhite = srcCell.bHasWhiteChip
      const _bSourceHasWhiteKing = srcCell.bHasWhiteKing

      // Check if the movement is on the diagonal
      const xDiff = Math.abs(coords.nRow - coords.nDestRow)
      const yDiff = Math.abs(coords.nCol - coords.nDestCol)
      const bOnDiagonal = xDiff === yDiff

      // Check for jumps
      const bDoesNoBlackJumps = bNoBlackJumps(state.cells, coords)
      const bDoesNoWhiteJumps = bNoWhiteJumps(state.cells, coords)
      // console.log(bDoesNoBlackJumps + bDoesNoWhiteJumps)

      if (bIsSquareOpen && _bSourceHasBlack && _bSourceHasBlackKing && bDoesNoBlackJumps && bDoesNoWhiteJumps && bOnDiagonal) {
        bIsValid = true
        newDest.bHasBlackChip = true
        newDest.bHasBlackKing = true
      } else if (bIsSquareOpen && _bSourceHasWhite && _bSourceHasWhiteKing && bDoesNoBlackJumps && bDoesNoWhiteJumps && bOnDiagonal) {
        bIsValid = true
        newDest.bHasWhiteChip = true
        newDest.bHasWhiteKing = true
      }

      // Check if the move is valid
      if (bIsValid) {
        // Perform a deep copy of the board with the new positions of chips
        const stateClone = JSON.parse(JSON.stringify(state.cells))

        stateClone[newCurr.nRow - 1][newCurr.nCol - 1] = newCurr
        stateClone[newDest.nRow - 1][newDest.nCol - 1] = newDest

        state.cells = stateClone
        state.firstClick = null
      } else {
        const bDestHasWhite = state.cells[coords.nDestRow - 1][coords.nDestCol - 1].bHasWhiteChip
        const bDestHasBlack = state.cells[coords.nDestRow - 1][coords.nDestCol - 1].bHasBlackChip
        const bSrcDestBlack = bSourceHasBlack(state.cells, coords) && bDestHasBlack
        const bSrcDestWhite = bSourceHasWhite(state.cells, coords) && bDestHasWhite

        const bSrcHasWhiteKing = state.cells[coords.nRow - 1][coords.nCol - 1].bHasWhiteKing
        const bSrcHasBlackKing = state.cells[coords.nRow - 1][coords.nCol - 1].bHasBlackKing
        const bDestHasWhiteKing = state.cells[coords.nDestRow - 1][coords.nDestCol - 1].bHasWhiteKing
        const bDestHasBlackKing = state.cells[coords.nDestRow - 1][coords.nDestCol - 1].bHasBlackKing

        let newCoords

        // If both the source and destination pieces have the same color -
        // this happens when clicking on a piece followed by clicking another
        // same-colored piece adjacent to it
        if (bSrcDestBlack || bSrcDestWhite) {
          newCoords = { nRow: coords.nDestRow, nCol: coords.nDestCol, bHasBlackKing: bDestHasBlackKing, bHasWhiteKing: bDestHasWhiteKing }
        } else { // Otherwise, simply set it to the current coordinates
          newCoords = { nRow: coords.nRow, nCol: coords.nCol, bHasBlackKing: bSrcHasBlackKing, bHasWhiteKing: bSrcHasWhiteKing }
        }

        mutations.mHighlight(state.cells, newCoords)
        state.firstClick = newCoords
      }
    }
  },

  mCapturePiece: (state, coords) => {
    const newCur = {
      nRow: coords.nRow,
      nCol: coords.nCol,
      bHasBlackChip: false,
      bHasWhiteChip: false,
      bHasBlackKing: false,
      bHasWhiteKing: false
    }

    const adjacent = {
      nRow: Math.floor((coords.nRow + coords.nDestRow) / 2),
      nCol: Math.floor((coords.nCol + coords.nDestCol) / 2),
      bHasBlackChip: false,
      bHasWhiteChip: false,
      bHasBlackKing: false,
      bHasWhiteKing: false
    }

    const newDest = {
      nRow: coords.nDestRow,
      nCol: coords.nDestCol,
      bHasBlackChip: false,
      bHasWhiteChip: false,
      bHasBlackKing: false,
      bHasWhiteKing: false
    }

    let bIsValidCapture = false
    const bNextRowBelow = coords.nRow - 2 === coords.nDestRow
    const bNextRowAbove = coords.nRow + 2 === coords.nDestRow
    const bLastRowBelow = coords.nDestRow === 1
    const bLastRowAbove = coords.nDestRow === 8
    const bWhiteCanCapture = bSourceHasWhite(state.cells, coords) && bBlackExistsAdj(state.cells, coords) && bNextRowAbove
    const bBlackCanCapture = bSourceHasBlack(state.cells, coords) && bWhiteExistsAdj(state.cells, coords) && bNextRowBelow

    if (bWhiteCanCapture) {
      if (!bPieceExistsAfterAdj(state.cells, coords)) {
        bIsValidCapture = true
        newDest.bHasWhiteChip = true
        if (bLastRowAbove) {
          newDest.bHasWhiteKing = true
        }
      }
    } else if (bBlackCanCapture) {
      if (!bPieceExistsAfterAdj(state.cells, coords)) {
        bIsValidCapture = true
        newDest.bHasBlackChip = true
        if (bLastRowBelow) {
          newDest.bHasBlackKing = true
        }
      }
    }

    if (bIsValidCapture) {
      const stateClone = JSON.parse(JSON.stringify(state.cells))

      stateClone[newCur.nRow - 1][newCur.nCol - 1] = newCur
      stateClone[adjacent.nRow - 1][adjacent.nCol - 1] = adjacent
      stateClone[newDest.nRow - 1][newDest.nCol - 1] = newDest

      state.cells = stateClone
      state.firstClick = null
    } else {
      const bDestHasWhite = state.cells[coords.nDestRow - 1][coords.nDestCol - 1].bHasWhiteChip
      const bDestHasBlack = state.cells[coords.nDestRow - 1][coords.nDestCol - 1].bHasBlackChip
      const bSrcDestBlack = bSourceHasBlack(state.cells, coords) && bDestHasBlack
      const bSrcDestWhite = bSourceHasWhite(state.cells, coords) && bDestHasWhite

      const bSrcHasWhiteKing = state.cells[coords.nRow - 1][coords.nCol - 1].bHasWhiteKing
      const bSrcHasBlackKing = state.cells[coords.nRow - 1][coords.nCol - 1].bHasBlackKing
      const bDestHasWhiteKing = state.cells[coords.nDestRow - 1][coords.nDestCol - 1].bHasWhiteKing
      const bDestHasBlackKing = state.cells[coords.nDestRow - 1][coords.nDestCol - 1].bHasBlackKing

      let newCoords

      // If both the source and destination pieces have the same color -
      // this happens when clicking on a piece followed by clicking another
      // same-colored piece adjacent to it
      if (bSrcDestBlack || bSrcDestWhite) {
        newCoords = { nRow: coords.nDestRow, nCol: coords.nDestCol, bHasBlackKing: bDestHasBlackKing, bHasWhiteKing: bDestHasWhiteKing }
      } else { // Otherwise, simply set it to the current coordinates
        newCoords = { nRow: coords.nRow, nCol: coords.nCol, bHasBlackKing: bSrcHasBlackKing, bHasWhiteKing: bSrcHasWhiteKing }
      }

      mutations.mHighlight(state.cells, newCoords)
      state.firstClick = newCoords
    }
  },

  mKingCapturePiece: (state, coords) => {
    const newCur = {
      nRow: coords.nRow,
      nCol: coords.nCol,
      bHasWhiteChip: false,
      bHasBlackChip: false,
      bHasWhiteKing: false,
      bHasBlackKing: false
    }

    const newDest = {
      nRow: coords.nDestRow,
      nCol: coords.nDestCol,
      bHasWhiteChip: false,
      bHasBlackChip: false,
      bHasWhiteKing: false,
      bHasBlackKing: false
    }

    let color
    if (bSourceHasWhite(state.cells, coords)) {
      color = 'white'
    } else if (bSourceHasBlack(state.cells, coords)) {
      color = 'black'
    }

    const result = bIsValidCapture(state.cells, coords, color)
    if (result.validCapture) {
      if (bSourceHasWhite(state.cells, coords)) {
        newDest.bHasWhiteChip = true
        newDest.bHasWhiteKing = true
      } else if (bSourceHasBlack(state.cells, coords)) {
        newDest.bHasBlackChip = true
        newDest.bHasBlackKing = true
      }

      const newTarget = {
        ...result.targetPiece,
        bHasWhiteChip: false,
        bHasBlackChip: false,
        bHasWhiteKing: false,
        bHasBlackKing: false
      }
      const stateClone = JSON.parse(JSON.stringify(state.cells))

      stateClone[newCur.nRow - 1][newCur.nCol - 1] = newCur
      stateClone[newTarget.nRow - 1][newTarget.nCol - 1] = newTarget
      stateClone[newDest.nRow - 1][newDest.nCol - 1] = newDest

      state.cells = stateClone
      state.firstClick = null
    }
  },

  mReducePiece: (state, whiteTakes) => {
    if (!whiteTakes) {
      state.nWhiteCount = state.nWhiteCount - 1
    } else {
      state.nBlackCount = state.nBlackCount - 1
    }
  }
}

export default mutations