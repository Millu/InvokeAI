import { ButtonGroup, Collapse, Flex, Grid, GridItem } from '@chakra-ui/react';
import { createSelector } from '@reduxjs/toolkit';
import { stateSelector } from 'app/store/store';
import { useAppSelector } from 'app/store/storeHooks';
import { defaultSelectorOptions } from 'app/store/util/defaultMemoizeOptions';
import IAIIconButton from 'common/components/IAIIconButton';
import { AnimatePresence, motion } from 'framer-motion';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { memo, useCallback, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useListAllBoardsQuery } from 'services/api/endpoints/boards';
import { BoardDTO } from 'services/api/types';
import { useFeatureStatus } from '../../../../system/hooks/useFeatureStatus';
import DeleteBoardModal from '../DeleteBoardModal';
import AddBoardButton from './AddBoardButton';
import BoardsSearch from './BoardsSearch';
import GalleryBoard from './GalleryBoard';
import SystemBoardButton from './SystemBoardButton';

const selector = createSelector(
  [stateSelector],
  ({ boards, gallery }) => {
    const { searchText } = boards;
    const { selectedBoardId } = gallery;
    return { selectedBoardId, searchText };
  },
  defaultSelectorOptions
);

type Props = {
  isOpen: boolean;
};

const BoardsList = (props: Props) => {
  const { isOpen } = props;
  const { selectedBoardId, searchText } = useAppSelector(selector);
  const { data: boards } = useListAllBoardsQuery();
  const isBatchEnabled = useFeatureStatus('batches').isFeatureEnabled;
  const filteredBoards = searchText
    ? boards?.filter((board) =>
        board.board_name.toLowerCase().includes(searchText.toLowerCase())
      )
    : boards;
  const [boardToDelete, setBoardToDelete] = useState<BoardDTO>();
  const [isSearching, setIsSearching] = useState(false);
  const handleClickSearchIcon = useCallback(() => {
    setIsSearching((v) => !v);
  }, []);

  return (
    <>
      <Collapse in={isOpen} animateOpacity>
        <Flex
          layerStyle={'first'}
          sx={{
            flexDir: 'column',
            gap: 2,
            p: 2,
            mt: 2,
            borderRadius: 'base',
          }}
        >
          <Flex sx={{ gap: 2, alignItems: 'center' }}>
            <AnimatePresence mode="popLayout">
              {isSearching ? (
                <motion.div
                  key="boards-search"
                  initial={{
                    opacity: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.1 },
                  }}
                  style={{ width: '100%' }}
                >
                  <BoardsSearch setIsSearching={setIsSearching} />
                </motion.div>
              ) : (
                <motion.div
                  key="system-boards-select"
                  initial={{
                    opacity: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.1 },
                  }}
                  style={{ width: '100%' }}
                >
                  <ButtonGroup sx={{ w: 'full', ps: 1.5 }} isAttached>
                    <SystemBoardButton board_id="images" />
                    <SystemBoardButton board_id="assets" />
                    <SystemBoardButton board_id="no_board" />
                  </ButtonGroup>
                </motion.div>
              )}
            </AnimatePresence>
            <IAIIconButton
              aria-label="Search Boards"
              size="sm"
              isChecked={isSearching}
              onClick={handleClickSearchIcon}
              icon={<FaSearch />}
            />
            <AddBoardButton />
          </Flex>
          <OverlayScrollbarsComponent
            defer
            style={{ height: '100%', width: '100%' }}
            options={{
              scrollbars: {
                visibility: 'auto',
                autoHide: 'move',
                autoHideDelay: 1300,
                theme: 'os-theme-dark',
              },
            }}
          >
            <Grid
              className="list-container"
              sx={{
                gridTemplateColumns: `repeat(auto-fill, minmax(96px, 1fr));`,
                maxH: 346,
              }}
            >
              {filteredBoards &&
                filteredBoards.map((board) => (
                  <GridItem key={board.board_id} sx={{ p: 1.5 }}>
                    <GalleryBoard
                      board={board}
                      isSelected={selectedBoardId === board.board_id}
                      setBoardToDelete={setBoardToDelete}
                    />
                  </GridItem>
                ))}
            </Grid>
          </OverlayScrollbarsComponent>
        </Flex>
      </Collapse>
      <DeleteBoardModal
        boardToDelete={boardToDelete}
        setBoardToDelete={setBoardToDelete}
      />
    </>
  );
};

export default memo(BoardsList);
