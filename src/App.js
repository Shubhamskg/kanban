import "./App.css";
import Board from "./components/Board";
import { useEffect,useState } from "react";
import { groupList, orderList, priorityMap,ordering, groups } from "./data/data";
import { VscSettings } from "react-icons/vsc";
import { getLocalStorage,setLocalStorage } from "./helper/localStorage";
import { fetchKanbanData } from "./data/fetchData";
function groupTicketsByProp(props, state) {
    const groupTickets = {};
    state.forEach((ticket) => {
        const value = ticket[props];
        if (!groupTickets[value]) {
            groupTickets[value] = [];
        }
        groupTickets[value].push(ticket);
    });
    return groupTickets;
}
function App() {
  const [users, setUsers] = useState();
    const [tickets, setTickets] = useState();
    const [selectOrder, setselectOrder] = useState(() => {
      const storedState = getLocalStorage("selectOrder");
      return storedState ? storedState : ordering.PRIORITY;
  });
    const [selectGroup, setselectGroup] = useState(() => {
        const storedState = getLocalStorage("selectGroup");
        return storedState ? storedState : groups.STATUS;
    });
    const [FilterContainer, setFilterContainer] = useState(false);
    function getNameById(id) {
        const foundUser = users.find((u) => u.id === id);
        return foundUser ? foundUser.name : "User not found";
    }
    const [displayState, setDisplayState] = useState(() => {
        const storedState = getLocalStorage("currentstate");
        return storedState ? storedState : [];
    });
    useEffect(() => {
      if (tickets === undefined) return;
      if (displayState.length === 0) {
          const ticketsGroupedByStatus = groupTicketsByProp(
              "status",
              tickets
          );
          setDisplayState(ticketsGroupedByStatus);
          setLocalStorage("currentstate", ticketsGroupedByStatus);
      }
  }, [tickets]);
    useEffect(() => {
        const kanbanData = async () => {
            try {
                const results = await fetchKanbanData();
                setTickets(results.tickets);
                setUsers(results.users);
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };
        kanbanData();
    }, []);
    
    const groupHandler = (e) => {
        setFilterContainer(false);
        setselectGroup(e.target.value);
        setLocalStorage("selectGroup", e.target.value);
        if (e.target.value === "user") {
            const ticketsGroupedByName = groupTicketsByProp(
                "userId",
                tickets
            );
            Object.keys(ticketsGroupedByName).forEach(function (key) {
                var newkey = getNameById(key);
                ticketsGroupedByName[newkey] = ticketsGroupedByName[key];
                delete ticketsGroupedByName[key];
            });
            setDisplayState(ticketsGroupedByName);
            setLocalStorage("currentstate", ticketsGroupedByName);
        }else if (e.target.value === "priority") {
          const ticketsGroupedByPriority = groupTicketsByProp(
              "priority",
              tickets
          );
          Object.keys(ticketsGroupedByPriority).forEach(function (key) {
              var newkey = priorityMap[key];
              ticketsGroupedByPriority[newkey] =
                  ticketsGroupedByPriority[key];
              delete ticketsGroupedByPriority[key];
          });
          setDisplayState(ticketsGroupedByPriority);
          setLocalStorage("currentstate", ticketsGroupedByPriority);
      }
         else if (e.target.value === "status") {
            const ticketsGroupedByStatus = groupTicketsByProp(
                "status",
                tickets
            );
            setDisplayState(ticketsGroupedByStatus);
            setLocalStorage("currentstate", ticketsGroupedByStatus);
        } 
    };
    const orderHandler = (e) => {
        setFilterContainer(false);
        setselectOrder(e.target.value);
        setLocalStorage("selectOrder", e.target.value);
        if (e.target.value === "priority") {
            const sortTasksByPriority = (tasks) => {
                return tasks.slice().sort((a, b) => b.priority - a.priority);
            };

            const sortedData = {};

            for (const userName in displayState) {
                const userTasks = displayState[userName];
                const sortedTasks = sortTasksByPriority(userTasks);
                sortedData[userName] = sortedTasks;
            }

            setDisplayState(sortedData);
            setLocalStorage("currentstate", sortedData);
        } else if (e.target.value === "title") {
            const sortTasksByTitleAscending = (tasks) => {
                return tasks
                    .slice()
                    .sort((a, b) => a.title.localeCompare(b.title));
            };

            const sortedData = {};

            for (const userName in displayState) {
                const userTasks = displayState[userName];
                const sortedTasks = sortTasksByTitleAscending(userTasks);
                sortedData[userName] = sortedTasks;
            }
            setDisplayState(sortedData);
            setLocalStorage("currentstate", sortedData);
        }
    };

    return (
        <article>
            <header>
                <div className="sl-cnt">
                    <div
                        className="disp-btn brd-crv pointer"
                        onClick={() => {
                            setFilterContainer((prev) => !prev);
                        }}
                    >
                        <VscSettings className="setting"/>
                        <p>Display</p>
                    </div>
                    {FilterContainer ? (
                        <div className="sl-popup brd-crv">
                            <div className="flx-cnt">
                                <p>Grouping</p>
                                <select
                                    className="sl-ele"
                                    name="grp-sl"
                                    onChange={(e) => groupHandler(e)}
                                    value={selectGroup}
                                >
                                    {groupList.map((item) => (
                                        <option
                                            value={item}
                                            label={item}
                                            key={item}
                                        />
                                    ))}
                                </select>
                            </div>

                            <div className="flx-cnt">
                                <p>Ordering</p>
                                <select
                                    className="sl-ele"
                                    name="ord-sl"
                                    onChange={(e) => orderHandler(e)}
                                    value={selectOrder}
                                >
                                    {orderList.map((item) => (
                                        <option
                                            value={item}
                                            label={item}
                                            key={item}
                                        />
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : null}
                </div>
            </header>
            <main className="main-cnt">
                <div className="brd-grd-cnt">
                    <div className="brd-grd-inn">
                        {Object.keys(displayState).map((data) => {
                            return (
                                <Board
                                    title={data}
                                    tickets={displayState[data]}
                                    key={data}
                                />
                            );
                        })}
                    </div>
                </div>
            </main>
        </article>
    );
}

export default App;
