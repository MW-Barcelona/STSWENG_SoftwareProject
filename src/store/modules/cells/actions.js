const actions = {
  aHighlight({ commit }, coords) {
    commit('mHighlight', coords)
  },

  /**
   * aMoveForward moves a black or white chip to an empty cell 1 space diagonally
   * @param nRow - 1-based row of active cell with piece to move
   * @param nCol - 1-based column of active cell with piece to move
   * @param nDestRow - 1-based row of empty destination cell
   * @param nDestCol - 1-based column of empty destination cell
   */
  aMoveForward({ commit }, coords) {
    commit('mMoveForward', coords)
  },

  /**
   * aMoveForward moves a black or white chip to an empty cell 1 space diagonally
   * @param nRow - 1-based row of active cell with piece to move
   * @param nCol - 1-based column of active cell with piece to move
   * @param nDestRow - 1-based row of empty destination cell
   * @param nDestCol - 1-based column of empty destination cell
   */
  aKingMovement({ commit }, coords) {
    commit('mKingMovement', coords)
  },

  /**
   * aCapturePiece moves a black or white chip to capture an opposite-colored piece
   * diagonally adjacent from it.
   *
   * @param coords - an object containing the source and destination coordinates
   */
  aCapturePiece({ commit }, coords) {
    commit('mCapturePiece', coords)
  },

  /**
   * aKingCapturePiece moves a black or white king to capture an opposite-colored piece
   * in its diagonal
   *
   * @param coords - an object containing the source and destination coordinates
   */
  aKingCapturePiece({ commit }, coords) {
    commit('mKingCapturePiece', coords)
  },

  /**
   * aReducePiece reduces nBlackCount if param is true, reduces nWhiteCount otherwise
   * 
   * @param whiteTakes - if white is the taking piece
   */
  aReducePiece({ commit }, whiteTakes) {
    commit('mReducePiece', whiteTakes)
  }
}

export default actions